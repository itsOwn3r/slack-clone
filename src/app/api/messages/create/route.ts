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

        const { body, image, workspaceId, channelId, memberId, parentMessageId } = data;

        if (!body || !memberId) {
            return NextResponse.json({ success: false, message: "Name and memberId is required!" });
        }

        const createMessage = await db.messages.create({
            data: {
                body,
                channelId,
                image,
                memberId,
                parentMessageId,
                workspaceId
            }
        })

        if (!createMessage) {
            return NextResponse.json({ success: false, message: "You are not admin!" });
        }



        return NextResponse.json({ success: true, message: "Channel created!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}