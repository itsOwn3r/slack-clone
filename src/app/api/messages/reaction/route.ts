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

        const { messageId } = data;

        if (!messageId) {
            return NextResponse.json({ success: false, message: "messageId is required!" });
        }

        const findReactions = await db.reactions.findMany({
            where: {
                messageId
            }
        })




        return NextResponse.json({ success: true, message: "Successful!", reactions: findReactions });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}