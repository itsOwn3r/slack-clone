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

        const { workspaceId } = data;

        const findUser = await db.user.findUnique({
            where: {
                id: user.user.id
            }
        })

        const id = findUser?.id;

        if (!workspaceId || !findUser || !id) {
            return NextResponse.json({ success: false, message: "workspaceId and UserId is required!" });
        }

        const findMember = await db.members.findFirst({
            where: {
                workspaceId,
                userId: id
            }
        })

        if (!findMember) {
            return NextResponse.json({ success: false, message: "Member cannot be found!" });
        }

        if (findMember.role === "admin") {
            return NextResponse.json({ success: false, message: "Admins cannot Leave!" });
        }


        const leaveWorkspace = await db.members.delete({
            where: {
                workspaceId,
                id: findMember.id,
                userId: findMember.userId
            }
        })

        if (leaveWorkspace) {
            return NextResponse.json({ success: true, message: "You leaved the Workspace!" });
        } else {
            return NextResponse.json({ success: false, message: "Something went Wrong!" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}