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

        const { workspaceId, memberId } = data;

        if (!memberId) {
            return NextResponse.json({ success: false, message: "memberId is required!" });
        }

        const findMember = await db.members.findUnique({
            where: {
                workspaceId,
                id: Number(memberId)
            },
            include: {
                user: true
            }
        })

        return NextResponse.json({ success: true, name: findMember?.user.name, message: "Member Found!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}