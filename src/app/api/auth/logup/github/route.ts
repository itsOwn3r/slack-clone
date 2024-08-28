import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const test = await signIn("github");
console.log(test);
    return NextResponse.json({ success: true })
}