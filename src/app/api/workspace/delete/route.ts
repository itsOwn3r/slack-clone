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

        const { id } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: "Id is required!" });
        }

        const findWorkspace = await db.workspaces.findUnique({
            where: {
                id,
                userId: user.user.id
            }
        })

        if (!findWorkspace) {
            return NextResponse.json({ success: false, message: "You need to be admin!" });
        }

        const deleteMembers = await db.members.deleteMany({
            where: {
                workspaceId: id
            }
        })

        const deleteChannels = await db.channels.deleteMany({
            where: {
                workspaceId: id
            }
        })

        const deleteWorkspace = await db.workspaces.delete({
            where: {
                id,
                userId: user.user.id
            }
        })


        return NextResponse.json({ success: true, message: "Workspace update!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}