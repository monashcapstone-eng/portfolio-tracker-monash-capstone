import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required" }, { status: 400 });
    }

    const apiKey = process.env.ALPHA_VANTAGE_KEY;
    if (!apiKey || apiKey === "your_key") {
      return NextResponse.json({ demo: true });
    }

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    // Check for rate limit or error
    if (data["Note"] || data["Information"] || data["Error Message"]) {
      console.warn("Alpha Vantage rate limit or error:", data["Note"] || data["Information"] || data["Error Message"]);
      return NextResponse.json({ demo: true });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Benchmark API error:", error);
    return NextResponse.json({ demo: true });
  }
}
