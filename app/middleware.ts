import { NextRequest, NextResponse } from "next/server";
import { initializeSocket } from "./socket";

export function middleware(req: NextRequest) {
  if (!globalThis.__io) {
    initializeSocket(globalThis);
    globalThis.__io = true; // Prevent duplicate initialization
  }
  return NextResponse.next();
}
