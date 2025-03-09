import { NextResponse } from "next/server";
import { activateToken } from "../../db";

export async function POST(req: Request) {
  try {
    const { token, user } = await req.json();

    // Check if token and user email are provided
    if (token === undefined || user === undefined) {
      throw new Error("Token and user email are required");
    }

    await activateToken(token, user);

    return NextResponse.json({ user });

  } catch (error) {
    console.error("Error activating token:", error);
    throw new Error("Token activation failed");
  }
}
