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

        const { name, id } = data;

        if (!name || !id) {
            return NextResponse.json({ success: false, message: "Name and Id is required!" });
        }

        const findWorkspace = await db.members.findFirst({
            where: {
                workspaceId: id,
                userId: user.user.id
            }
        })

        if (findWorkspace?.role !== "admin") {
            return NextResponse.json({ success: false, message: "You need to be admin!" });
        }

        const updateWorkspace = await db.workspaces.update({
            where: {
                id,
                OR: [
                    { userId: user.user.id },
                    { Members: {
                        some: {
                            userId: user.user.id,
                            role: "admin"
                        }
                    } },
                ]
            },
            data: {
                name,
            }
        })


        return NextResponse.json({ success: true, id: updateWorkspace.id, message: "Workspace update!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}