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

        const { id, body } = data;

        if (!id || !body) {
            return NextResponse.json({ success: false, message: "Message Id is required!" });
        }

        const editMessage = await db.messages.update({
            where: {
                id: id,
                userId: user.user.id,
            },
            data: {
                body,
                updatedAt: new Date()
            }
        })

        if (!editMessage) {
        return NextResponse.json({ success: false, message: "Message Not Found!" });            
        }


        return NextResponse.json({ success: true, message: "Message Edited!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}