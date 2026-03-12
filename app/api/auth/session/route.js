import { adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();
    const decoded = await adminAuth.verifyIdToken(token);
    return NextResponse.json({ uid: decoded.uid, email: decoded.email });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
