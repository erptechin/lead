import prisma from "@/app/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/libs/utility";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const resource = "user";

export async function GET(request: NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100

        const role = request.nextUrl.searchParams.get("role") || "user"

        const counts = await prisma[resource].count()
        const result = await prisma[resource].findMany({
            where: { role },
            skip,
            take,
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
        delete data.firstName
        delete data.lastName

        const res = await prisma[resource].create({ data });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        const { id, name, status } = data
        const res = await prisma[resource].update({
            where: { id },
            data: { name, status }
        });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return errorResponse("You are not Not Authorized", 401);

        const id = Number(request.nextUrl.searchParams.get("id"))
        if (!id) return errorResponse("Record Not Found");

        const res = await prisma[resource].delete({ where: { id } });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}