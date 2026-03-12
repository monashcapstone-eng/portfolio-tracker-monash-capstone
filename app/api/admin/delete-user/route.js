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

export async function POST(request) {
  const decoded = await verifyAdmin(request);
  if (!decoded) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { targetUid } = await request.json();
    if (!targetUid) return NextResponse.json({ error: "Target UID required" }, { status: 400 });
    if (targetUid === decoded.uid) return NextResponse.json({ error: "Cannot delete self" }, { status: 400 });

    // Delete from Firebase Auth
    await adminAuth.deleteUser(targetUid);

    // Cascade delete Firestore documents
    const collections = ["activities", "holdings", "brokers", "portfolio_snapshots"];
    for (const col of collections) {
      const snapshot = await adminDb.collection(col).where("user_id", "==", targetUid).get();
      const batch = adminDb.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      if (!snapshot.empty) await batch.commit();
    }

    await adminDb.collection("user_settings").doc(targetUid).delete().catch(() => {});

    // Delete user profile
    await adminDb.collection("users").doc(targetUid).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
