import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { handleServerError } from "@/lib/server-errors";
import { NextResponse } from "next/server";

async function verifyAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    return await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
  } catch {
    return null;
  }
}

export async function GET(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settingsDoc = await adminDb.collection("user_settings").doc(decoded.uid).get();

    if (!settingsDoc.exists) {
      return NextResponse.json({
        user_id: decoded.uid,
        default_currency: "AUD",
        theme: "light",
        notification_preferences: {},
      });
    }

    return NextResponse.json(settingsDoc.data());
  } catch (error) {
    return handleServerError(
      "Settings fetch error",
      error,
      "Unable to fetch settings"
    );
  }
}

export async function PUT(request) {
  const decoded = await verifyAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const payload = {
      user_id: decoded.uid,
      default_currency: data.default_currency || "AUD",
      theme: data.theme || "light",
      exchange_rates: data.exchange_rates || {},
      notification_preferences: data.notification_preferences || {},
      updated_at: new Date().toISOString(),
    };

    await adminDb.collection("user_settings").doc(decoded.uid).set(payload, {
      merge: true,
    });

    return NextResponse.json(payload);
  } catch (error) {
    return handleServerError(
      "Settings update error",
      error,
      "Unable to update settings"
    );
  }
}
