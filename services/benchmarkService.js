const cache = {};

export const BENCHMARK_OPTIONS = [
  { label: "S&P 500", value: "SPY", description: "US Large Cap" },
  { label: "ASX 200", value: "IOZ.AX", description: "Australian Market" },
  { label: "NASDAQ 100", value: "QQQ", description: "US Tech Heavy" },
];

function generateDemoData(symbol) {
  const months = 36;
  const now = new Date();
  const data = [];

  let trendPerMonth, volatility;
  switch (symbol) {
    case "QQQ":
      trendPerMonth = 1.2;
      volatility = 6;
      break;
    case "IOZ.AX":
      trendPerMonth = 0.6;
      volatility = 4;
      break;
    default: // SPY
      trendPerMonth = 0.8;
      volatility = 4;
  }

  let price = 100;
  for (let i = months; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const dateStr = date.toISOString().split("T")[0];
    const change = trendPerMonth + (Math.random() - 0.5) * volatility;
    price = price * (1 + change / 100);
    data.push({ date: dateStr, close: Math.round(price * 100) / 100 });
  }

  cache[symbol] = data;
  return data;
}

export async function fetchMonthlyPrices(symbol) {
  if (cache[symbol]) return cache[symbol];

  try {
    const res = await fetch(`/api/benchmark?symbol=${encodeURIComponent(symbol)}`);
    const data = await res.json();

    if (data.demo) {
      console.warn("Using demo benchmark data for", symbol);
      return generateDemoData(symbol);
    }

    const timeSeries = data["Monthly Adjusted Time Series"];
    if (!timeSeries) {
      console.warn("No time series data, using demo for", symbol);
      return generateDemoData(symbol);
    }

    const prices = Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        close: parseFloat(values["5. adjusted close"]),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    cache[symbol] = prices;
    return prices;
  } catch (error) {
    console.error("Benchmark fetch error:", error);
    return generateDemoData(symbol);
  }
}

export async function getBenchmarkGrowth(symbol, startDate, endDate) {
  const prices = await fetchMonthlyPrices(symbol);

  const filtered = prices.filter((p) => {
    const d = new Date(p.date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });

  if (filtered.length === 0) return [];

  const basePrice = filtered[0].close;
  return filtered.map((p) => ({
    date: p.date,
    growthPct: ((p.close - basePrice) / basePrice) * 100,
  }));
}

export function clearCache() {
  Object.keys(cache).forEach((key) => delete cache[key]);
}
