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

        const { id } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: "Message Id is required!" });
        }


        const deleteMessage = await db.messages.delete({
            where:{
                id,
                userId: user.user.id
            }
        })


        return NextResponse.json({ success: true, message: "Message Deleted! 🔴" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}