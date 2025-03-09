import { NextResponse } from "next/server";
import { verifyToken, getTokenData } from "../../db";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const tokenDataArray = await getTokenData(token);
    const tokenData = tokenDataArray[0];

    if (!tokenData || tokenData.used || !tokenData.expiresat || tokenData.expiresat < new Date()) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    // Mark token as used
    // await markTokenAsUsed(token);

    // Check that token exists
    await verifyToken(token);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}
