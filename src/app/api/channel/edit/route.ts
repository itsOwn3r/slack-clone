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

        const { name, channelId, workspaceId } = data;

        if (!name || !channelId || !workspaceId) {
            return NextResponse.json({ success: false, message: "Name and Channel Id and Workspace Id is required!" });
        }

        const sanatizeName = name.replaceAll(" ", "-");

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

        const editChannel = await db.channels.update({
            where:{
                id: channelId,
                userId: user.user.id,
            },
            data: {
                name: sanatizeName
            }
        })


        return NextResponse.json({ success: true, path: `/workspace/${editChannel.workspaceId}/channel/${editChannel.id}`, message: "Channel Edited!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}