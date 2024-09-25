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

        const { workspaceId, userId } = data;

        if (!userId || !workspaceId) {
            return NextResponse.json({ success: false, message: "userId and workspaceId is required!" });
        }

        const findMember = await db.members.findFirst({
            where: {
                id: Number(userId),
                workspaceId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                }
            }
        })

        if (!findMember) {
            return NextResponse.json({ success: false, message: "You are not a member of that Workspace!" });
        }

        return NextResponse.json({ success: true, message: "Successful!", profile: findMember });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}