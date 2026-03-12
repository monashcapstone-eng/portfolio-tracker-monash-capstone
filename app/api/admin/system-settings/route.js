import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

async function verifyAdmin(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists || !userDoc.data().is_admin) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request) {
  const decoded = await verifyAdmin(request);
  if (!decoded) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const settingsDoc = await adminDb.collection("system_settings").doc("singleton").get();
    return NextResponse.json(
      settingsDoc.exists
        ? settingsDoc.data()
        : {
            default_currency: "AUD",
            free_limit: 3,
            premium_limit: 999,
            default_theme: "light",
          }
    );
  } catch (error) {
    console.error("System settings fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const decoded = await verifyAdmin(request);
  if (!decoded) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const payload = await request.json();
    await adminDb.collection("system_settings").doc("singleton").set(payload, { merge: true });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("System settings update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
