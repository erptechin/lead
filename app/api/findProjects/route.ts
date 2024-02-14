import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";
import { sendEmail } from "../emails";
import language from "@/contexts/language";

const resource1 = "batiment";
const resource2 = "depannage";

export async function GET(request: NextRequest) {
    try {

        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100
        const title = request.nextUrl.searchParams.get("search")
        const assignTo = request.nextUrl.searchParams.get("assignTo")
        const status = request.nextUrl.searchParams.get("status")
        const assignStatus = request.nextUrl.searchParams.get("assignStatus")
        const profeionalId = request.nextUrl.searchParams.get("profeionalId")
        const id = request.nextUrl.searchParams.get("id")
        let where: any = {}
        if (title) where['title'] = { contains: title }
        if (profeionalId) where['profeionalId'] = profeionalId
        if (assignTo && status) where['assignTo'] = { has: { status, name: assignTo } }
        if (id) where['id'] = id
        if (assignStatus) where['assignStatus'] = assignStatus

        const result1 = await prisma[resource1].findMany({
            skip,
            take,
            where,
            include: { address: true, batimentCategory: { select: { name: true } }, batimentType: { select: { name: true } } }
        });
        const result2 = await prisma[resource2].findMany({
            skip,
            take,
            where,
            include: { address: true, depannageCategory: { select: { name: true, price: true } } }
        });
        if (!result1 || !result2) return errorResponse("Record Not Found");
        return successResponse([...result1, ...result2]);
    } catch (error: any) {
        errorResponse(error.message);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        let id = JSON.parse(JSON.stringify(data.id))
        delete data.id

        const { type, assignedDate, assignStatus, assignTo, name, status } = data
        const lead = await (prisma[type] as any).findMany({
            where: { id },
        })

        let allAssigns = []
        if (assignTo) {
            allAssigns = assignTo
        } else {
            allAssigns = lead[0].assignTo
            let index = lead[0].assignTo.findIndex((item: any) => item.name == name)
            allAssigns[index] = { status, name }
        }
        const res = await (prisma[type] as any).update({
            where: { id },
            data: { assignedDate, assignStatus, assignTo: allAssigns }
        });
        if (assignTo) {
            // Email Pro Users
            let ids = allAssigns.map((item: any) => item.name)
            const users: any = await prisma.user.findMany({ where: { id: { in: ids } } });
            for (let user of users) {
                let title = language?.professional_emails?.newLead_pro_title
                title = title.replace('[project]', `${lead[0].title}`);
                let body = language?.professional_emails?.newLead_pro_body
                body = body.replace('[name]', `${user.firstName} ${user.lastName}`);
                body = body.replace('[project]', `${lead[0].title}`);
                sendEmail(user.email, `${user.firstName} ${user.lastName}`, title, body)
            }
        } else {

        }
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}