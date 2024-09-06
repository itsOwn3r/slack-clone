import { auth } from "@/auth";
import db from "@/lib/db";
import { generateNumericToken } from "@/lib/GenerateToken";
import { NextResponse } from "next/server";

export async function POST(req: Request){ 
    try {

        const user = await auth();

        if (!user) {
            return NextResponse.json({ success: false, message: "Login is required!" });
        }

        const data = await req.json();

        const { id } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: "Id is required!" });
        }        

        const joinCode = generateNumericToken(5);

        const findWorkspace = await db.members.findFirst({
            where: {
                workspaceId: id,
                userId: user.user.id
            }
        })

        if (findWorkspace?.role !== "admin") {
            return NextResponse.json({ success: false, message: "You need to be admin!" });
        }

        const createWorkspace = await db.workspaces.update({
            where: {
                id
            },
            data: {
                joinCode
            }
        })

        return NextResponse.json({ success: true, joinCode, message: "Workspace created!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}