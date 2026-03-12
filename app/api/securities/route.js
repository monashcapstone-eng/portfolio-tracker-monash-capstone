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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    let ref = adminDb.collection("securities");
    const snapshot = await ref.get();
    let securities = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (query) {
      const q = query.toLowerCase();
      securities = securities.filter(
        (s) =>
          s.symbol?.toLowerCase().includes(q) ||
          s.name?.toLowerCase().includes(q)
      );
    }
    return NextResponse.json(securities);
  } catch (error) {
    return handleServerError(
      "Securities fetch error",
      error,
      "Unable to fetch securities"
    );
  }
}

export async function POST(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    if (!data.symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 });

    // Check for duplicate (symbol + exchange)
    const existing = await adminDb
      .collection("securities")
      .where("symbol", "==", data.symbol)
      .where("exchange", "==", data.exchange || "")
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    const security = {
      symbol: data.symbol,
      name: data.name || data.symbol,
      exchange: data.exchange || "",
      asset_class: data.asset_class || "Equity",
      sector: data.sector || "",
      currency: data.currency || "AUD",
    };
    const docRef = await adminDb.collection("securities").add(security);
    return NextResponse.json({ id: docRef.id, ...security }, { status: 201 });
  } catch (error) {
    return handleServerError(
      "Security create error",
      error,
      "Unable to create security"
    );
  }
}
