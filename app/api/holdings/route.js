import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { calculatePortfolioMetrics } from "@/lib/portfolio";
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
      .collection("holdings")
      .where("user_id", "==", decoded.uid)
      .get();

    if (!snapshot.empty) {
      const holdings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(holdings);
    }

    const activitySnapshot = await adminDb
      .collection("activities")
      .where("user_id", "==", decoded.uid)
      .get();
    const activities = activitySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const portfolio = calculatePortfolioMetrics(activities);
    const holdings = Object.entries(portfolio.holdings).map(([symbol, holding]) => ({
      id: symbol,
      user_id: decoded.uid,
      security_id: symbol,
      quantity: holding.qty,
      average_price: holding.averagePrice,
      cost_basis: holding.costBasis,
      market_value: holding.costBasis,
      unrealized_gain: 0,
      market: holding.market,
      currency: holding.currency,
      type: holding.type,
    }));

    return NextResponse.json(holdings);
  } catch (error) {
    return handleServerError(
      "Holdings fetch error",
      error,
      "Unable to fetch holdings"
    );
  }
}
