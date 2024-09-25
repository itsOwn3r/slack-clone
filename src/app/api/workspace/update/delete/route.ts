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

        const { id, workspaceId } = data;

        if (!workspaceId || !id) {
            return NextResponse.json({ success: false, message: "workspaceId and MemberId is required!" });
        }

        const findMember = await db.members.findUnique({
            where: {
                workspaceId,
                id
            }
        })

        if (!findMember) {
            return NextResponse.json({ success: false, message: "Member cannot be found!" });
        }

        const findAdmin = await db.user.findUnique({
            where: {
                id: user.user.id
            },
            include: {
                Workspaces: {
                    where: {
                        id: workspaceId
                    },
                    // include: {
                    //     Members: {
                    //         where: {
                    //             id: {

                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        })

        if (!findAdmin) {
            return NextResponse.json({ success: false, message: "Your account cannot be found!" });
        }

        const checkIsAdmin = await db.members.findFirst({
            where: {
                workspaceId,
                userId: findAdmin.id,

            }
        })

        if (!checkIsAdmin || checkIsAdmin.role !== "admin") {
            return NextResponse.json({ success: false, message: "You're not Admin of this Workspace!" });
        }

        const editRole = await db.members.delete({
            where: {
                workspaceId: id,
                id
            }
        })

        if (editRole) {
            return NextResponse.json({ success: true, message: "User got kicked!" });
        } else {
            return NextResponse.json({ success: false, message: "Something went Wrong!" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}