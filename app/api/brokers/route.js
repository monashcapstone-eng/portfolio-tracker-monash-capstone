import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { handleServerError } from "@/lib/server-errors";
import { NextResponse } from "next/server";

async function verifyAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
  } catch { return null; }
}

export async function GET(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const snapshot = await adminDb
      .collection("brokers")
      .where("user_id", "==", decoded.uid)
      .get();
    const brokers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(brokers);
  } catch (error) {
    return handleServerError(
      "Brokers fetch error",
      error,
      "Unable to fetch brokers"
    );
  }
}

export async function POST(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    if (!data.name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const existingSnapshot = await adminDb
      .collection("brokers")
      .where("user_id", "==", decoded.uid)
      .get();

    const existing = existingSnapshot.docs.find(
      (doc) =>
        doc.data().name?.trim().toLowerCase() === data.name.trim().toLowerCase()
    );

    if (existing) {
      return NextResponse.json({ id: existing.id, ...existing.data() });
    }

    const broker = {
      user_id: decoded.uid,
      name: data.name,
      description: data.description || "",
      created_at: new Date().toISOString(),
    };
    const docRef = await adminDb.collection("brokers").add(broker);
    return NextResponse.json({ id: docRef.id, ...broker }, { status: 201 });
  } catch (error) {
    return handleServerError(
      "Broker create error",
      error,
      "Unable to create broker"
    );
  }
}
