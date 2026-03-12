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
  } catch { return null; }
}

export async function GET(request) {
  const decoded = await verifyAdmin(request);
  if (!decoded) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const decoded = await verifyAdmin(request);
  if (!decoded) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { uid, ...data } = await request.json();
    if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });
    await adminDb.collection("users").doc(uid).update(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
