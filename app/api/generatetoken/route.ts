import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { insertToken } from "../../db";

export async function POST() {
  try {
    // Generate a secure random token
    const token = randomBytes(32).toString("hex");
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // Token expires in 2 minutes
    const used = false;

    await insertToken(token, createdAt, expiresAt, used);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
}
