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

        const { channelId, workspaceId } = data;

        if (!channelId || !workspaceId) {
            return NextResponse.json({ success: false, message: "Name and Channel Id and Workspace Id is required!" });
        }

        const findWorkspace = await db.workspaces.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                Members: {
                    where: {
                        userId: user.user.id
                    }
                }
            }
        })

        if (!findWorkspace || findWorkspace.Members[0].role !== "admin") {
            return NextResponse.json({ success: false, message: "Workspace not found! Or you're not admin!" });
        }

        const deleteChannel = await db.channels.delete({
            where:{
                id: channelId
            }
        })


        return NextResponse.json({ success: true, workspaceId, message: "Channel Deleted! 🔥" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}