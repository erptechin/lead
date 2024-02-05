import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const resource = "invoice";

export async function GET(request: NextRequest) {
    try {

        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100
        const userId = request.nextUrl.searchParams.get("userId")
        const leadId = request.nextUrl.searchParams.get("leadId")

        let where: any = {}
        if (userId) where['userId'] = userId
        if (leadId) where['leadId'] = userId

        const counts = await prisma[resource].count({ where })
        const result = await prisma[resource].findMany({
            skip,
            take,
            where
        });
        if (!result) return errorResponse("Record Not Found");
        return successResponse(result, counts);
    } catch (error: any) {
        errorResponse(error.message);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        const res = await prisma[resource].create({ data });

        return successResponse(res);
    } catch (error: any) {
        console.log(error)
        errorResponse(error);
    }
}