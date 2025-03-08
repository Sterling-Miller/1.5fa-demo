import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { insertToken } from "@/app/db";

export async function POST(req: Request) {
  try {
    const { browser, os } = await req.json();

    // Generate a secure random token
    const token = randomBytes(32).toString("hex");
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // Token expires in 2 minutes
    const used = false;

    await insertToken(token, createdAt, expiresAt, used, browser, os);

    return NextResponse.json({ token, used: false, type: "token" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
}
