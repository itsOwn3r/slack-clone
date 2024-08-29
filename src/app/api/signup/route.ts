import db from "@/lib/db";
import { SignupSchema } from "@/types/Schema";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request){ 
    try {

        const data = await req.json();

        const { name, email, password } = data;

        const validateForm = SignupSchema.safeParse({ name, email, password });

        if (!validateForm.success) {
            return NextResponse.json({ success: false, message: validateForm.error.issues[0].message});
        }

        const findUser = await db.user.findUnique({
            where: {
                email
            }
        })
        
        if (findUser) {
            return NextResponse.json({ success: false, message: "User already exist!" });
        }

        const hash = createHmac('sha256', process.env.SECRET!).update(password).digest('hex');

        const createUser = await db.user.create({
            data: {
                name, email, password: hash
            }
        })

        return NextResponse.json({ success: true, message: "User created!" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
}