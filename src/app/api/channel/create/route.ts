import { auth } from "@/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request){ 
    try {

        const user = await auth();

        if (!user) {
            return NextResponse.json({ success: false, message: "Login is required!" });
        }

        const data = await req.json();

        const { name, workspaceId } = data;

        if (!name || !workspaceId) {
            return NextResponse.json({ success: false, message: "Name and WorkspaceId is required!" });
        }

        const sanatizeName = name.replaceAll(" ", "-");

        const findWorkspace = await db.workspaces.findUnique({
            where: {
                id: workspaceId,
                userId: user.user.id
            }
        })

        if (!findWorkspace) {
            return NextResponse.json({ success: false, message: "You are not admin!" });
        }

        const createChannel = await db.channels.create({
            data: {
                name: sanatizeName,
                workspaceId,
                userId: user.user.id,
            }
        })


        return NextResponse.json({ success: true, path: `/workspace/${findWorkspace.id}/channel/${createChannel.id}`, message: "Channel created!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}