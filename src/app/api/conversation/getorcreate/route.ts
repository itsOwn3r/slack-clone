import { auth } from "@/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request){

    try {
        

    const user = await auth();

    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized!" });
    }

    const data = await req.json();

    const { workspaceId, memberId } = data;

    const currentMember = await db.members.findFirst({
        where: {
            userId: user.user.id,
            workspaceId: workspaceId,
        }
    });

    if(!currentMember) return NextResponse.json({ success: false, message: "Unauthorized!" });

    const otherMember = Number(memberId);

    const findConversation = await db.conversation.findFirst({
        where: {
            OR: [
                {
                    memberOneId: currentMember.id,
                    memberTwoId: otherMember,
                    workspaceId: workspaceId
                },
                {
                    memberTwoId: currentMember.id,
                    memberOneId: otherMember,
                    workspaceId: workspaceId
                }
            ]
        }
    })

    if (findConversation) {
        return NextResponse.json({ success: true, conversationId: findConversation.id });
    }

    const createConversation = await db.conversation.create({
        data: {
           memberOneId: currentMember.id,
           memberTwoId: otherMember,
           workspaceId: workspaceId, 
        }
    })

    return NextResponse.json({ success: true, conversationId: createConversation.id });

    } catch (error) {
            return NextResponse.json({ success: false, message: "Something went wrong!" })
    }
}