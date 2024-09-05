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

        const findWorkspace = await db.channels.findMany({
            where: {
                userId: user.user.id,
                workspaceId: id
            }
        })

        return NextResponse.json({ success: true, channels: findWorkspace, message: "Channels Found!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}