import prisma from "@/app/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/libs/utility";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const resource = "payment";
const subRes = "user";

export async function GET(request: NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100

        const counts = await prisma[resource].count()
        const result = await prisma[resource].findMany({
            skip,
            take,
            include: { user: true }
        });
        if (!result) return errorResponse("Record Not Found");
        return successResponse(result, counts);
    } catch (error: any) {
        console.log('error', error)
        errorResponse(error.message);
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        const { userId, type, amount, refId } = data
        const res = await prisma[resource].create({ data: { userId: parseInt(userId), type, amount: parseInt(amount), refId } });

        // Update wallet
        const user: any = await prisma[subRes].findUnique({ where: { id: parseInt(userId) } });
        let wallet = Number(user.wallet)
        let updAmount = wallet + Number(amount)
        await prisma[subRes].update({ where: { id: parseInt(userId) }, data: { wallet: updAmount } });

        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}