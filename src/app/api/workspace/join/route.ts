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

        const { joinCode, id } = data;

        if (!joinCode || !id) {
            return NextResponse.json({ success: false, message: "Join Code and Id is required!" });
        }   

        const findWorkspace = await db.workspaces.findUnique({
            where: {
                id,
                joinCode: Number(joinCode)
            }
        })        

        if (!findWorkspace) {
            return NextResponse.json({ success: false, message: "Workspace or Join Code Not Found!" });
        }


        const findMember = await db.members.findFirst({
            where: {
                workspaceId: id,
                userId: user.user.id
            }
        })

        
        if (findMember) {
            return NextResponse.json({ success: false, message: "User is already a member of this Workspace!" });
        }


        const createMember = await db.members.create({
            data: {
                workspaceId: id,
                userId: user.user.id,
                role: "member",
            }
        })

        return NextResponse.json({ success: true, workspaceId: findWorkspace.id, message: `You just joined the ${findWorkspace.name} Workspace!` });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}