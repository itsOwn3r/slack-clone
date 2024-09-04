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
            return NextResponse.json({ success: false, message: "ID is required!" });
        }

        const findWorkspace = await db.workspaces.findUnique({
            where: {
                id
            }
        })

        return NextResponse.json({ success: true, workspace: findWorkspace, message: "Workspace Found!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}