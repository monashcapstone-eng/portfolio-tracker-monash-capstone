import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { updatePortfolioSnapshot } from "@/lib/portfolio-snapshot";
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
      .collection("activities")
      .where("user_id", "==", decoded.uid)
      .orderBy("date", "desc")
      .get();

    const activities = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let securityName = data.code || "";
      let brokerName = "";
      if (data.security_id) {
        try {
          const secDoc = await adminDb.collection("securities").doc(data.security_id).get();
          if (secDoc.exists) securityName = secDoc.data().name || secDoc.data().symbol;
        } catch {}
      }
      if (data.broker_id) {
        try {
          const brkDoc = await adminDb.collection("brokers").doc(data.broker_id).get();
          if (brkDoc.exists) brokerName = brkDoc.data().name;
        } catch {}
      }
      activities.push({ id: doc.id, ...data, security_name: securityName, broker_name: brokerName });
    }
    return NextResponse.json(activities);
  } catch (error) {
    return handleServerError(
      "Activities fetch error",
      error,
      "Unable to fetch activities"
    );
  }
}

export async function POST(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const requiresQuantity = data.type !== "DIVIDEND";

    if (
      !data.type ||
      !data.date ||
      (requiresQuantity && (!data.quantity || !data.price))
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quantity = Number(data.quantity || 0);
    const price = Number(data.price || 0);
    const fees = Number(data.fees || 0);
    const totalAmount =
      data.total_amount !== undefined && data.total_amount !== null
        ? Number(data.total_amount)
        : data.type === "DIVIDEND"
          ? price
          : quantity * price;

    const activity = {
      ...data,
      user_id: decoded.uid,
      quantity: data.type === "DIVIDEND" ? 0 : quantity,
      price,
      fees,
      total_amount: totalAmount,
      created_at: new Date().toISOString(),
    };
    const docRef = await adminDb.collection("activities").add(activity);
    await updatePortfolioSnapshot(decoded.uid, adminDb);
    return NextResponse.json({ id: docRef.id, ...activity }, { status: 201 });
  } catch (error) {
    return handleServerError(
      "Activity create error",
      error,
      "Unable to create activity"
    );
  }
}
