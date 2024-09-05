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

        const { name } = data;

        if (!name) {
            return NextResponse.json({ success: false, message: "Name is required!" });
        }        

        const joinCode = generateNumericToken(5);

        const createWorkspace = await db.workspaces.create({
            data: {
                name,
                joinCode,
                userId: user.user.id,
                time: Math.ceil(Date.now() / 1000)
            }
        })

        const createMember = await db.members.create({
            data: {
                userId: user.user.id,
                role: "admin",
                workspaceId: createWorkspace.id
            }
        })

        const createChannel = await db.channels.create({
            data: {
                name: "general",
                userId: user.user.id,
                workspaceId: createWorkspace.id,
            }
        })
        return NextResponse.json({ success: true, id: createWorkspace.id, message: "Workspace created!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}