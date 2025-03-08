import { NextResponse } from "next/server";
import { getTokenByValue, markTokenAsUsed } from "../../db";
import { getSocketInstance, initializeSocket } from "../../socket";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const tokenData = await getTokenByValue(token);

    if (!tokenData || tokenData.used || new Date(tokenData.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    // Mark token as used
    await markTokenAsUsed(token);

    // Emit event using WebSockets
    const io = getSocketInstance();
    if (io) {
      io.emit("tokenUsed", { token });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}

