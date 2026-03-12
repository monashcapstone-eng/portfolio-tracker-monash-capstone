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
      .collection("portfolio_snapshots")
      .where("user_id", "==", decoded.uid)
      .orderBy("date", "desc")
      .limit(365)
      .get();
    const snapshots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(snapshots);
  } catch (error) {
    return handleServerError(
      "Snapshot fetch error",
      error,
      "Unable to fetch portfolio snapshots"
    );
  }
}

export async function POST(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const docId = `${decoded.uid}_${data.date}`;
    const snapshot = {
      user_id: decoded.uid,
      date: data.date,
      total_value: data.total_value || 0,
      total_cost: data.total_cost || 0,
      total_gain: data.total_gain || 0,
      daily_change: data.daily_change || null,
      cash_balance: data.cash_balance || 0,
      market_breakdown: data.market_breakdown || {},
    };
    await adminDb.collection("portfolio_snapshots").doc(docId).set(snapshot, { merge: true });
    return NextResponse.json({ id: docId, ...snapshot });
  } catch (error) {
    return handleServerError(
      "Snapshot save error",
      error,
      "Unable to save portfolio snapshot"
    );
  }
}
