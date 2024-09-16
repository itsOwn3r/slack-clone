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

        const { body, image, workspaceId, channelId, parentMessageId } = data;

        if (!body || !workspaceId) {
            return NextResponse.json({ success: false, message: "Name and workspaceId is required!" });
        }

        const findMember = await db.members.findFirst({
            where: {
                userId: user.user.id,
                workspaceId
            }
        })

        if (!findMember) {
            return NextResponse.json({ success: false, message: "You are not a member of that Workspace!" });
        }

        const createMessage = await db.messages.create({
            data: {
                body,
                channelId,
                // image,
                memberId: findMember.id,
                // parentMessageId,
                workspaceId,
                userId: user.user.id,

            }
        })

        if (!createMessage) {
            return NextResponse.json({ success: false, message: "Failed to send a message!" });
        }



        return NextResponse.json({ success: true, message: "Successful!", messageId: createMessage.id });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}