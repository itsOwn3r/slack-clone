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

        const findMember = await db.workspaces.findUnique({
            where: {
                id
            },
            include: {
                Members: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({ success: true, members: findMember?.Members, message: "Members Found!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}