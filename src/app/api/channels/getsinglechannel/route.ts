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

        const { workspaceId, channelId } = data;

        const findChannel = await db.channels.findUnique({
            where: {
                workspaceId,
                id: channelId
            }
        })

        return NextResponse.json({ success: true, channel: findChannel, message: "Channel Found!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}