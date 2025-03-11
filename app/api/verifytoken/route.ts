import { NextResponse } from "next/server";
import { verifyToken, getTokenData } from "../../db";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const tokenDataArray = await getTokenData(token);
    const tokenData = tokenDataArray[0];

    // TODO: check logic here
    if (!tokenData || tokenData.used || !tokenData.expiresat || tokenData.expiresat < new Date()) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    // Check that token exists
    if (await verifyToken(token) === false) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}
