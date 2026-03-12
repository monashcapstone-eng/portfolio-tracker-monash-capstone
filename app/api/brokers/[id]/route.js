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

export async function PUT(request, { params }) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const docRef = adminDb.collection("brokers").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (doc.data().user_id !== decoded.uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await request.json();
    await docRef.update({ name: data.name, description: data.description || "" });
    return NextResponse.json({ id, ...doc.data(), ...data });
  } catch (error) {
    return handleServerError(
      "Broker update error",
      error,
      "Unable to update broker"
    );
  }
}

export async function DELETE(request, { params }) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const docRef = adminDb.collection("brokers").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (doc.data().user_id !== decoded.uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleServerError(
      "Broker delete error",
      error,
      "Unable to delete broker"
    );
  }
}
