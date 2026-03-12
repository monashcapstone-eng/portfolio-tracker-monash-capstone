import { parseNumber, toIsoDate } from "@/lib/utils";

export function getActivitySymbol(activity = {}) {
  return (
    activity.code ||
    activity.symbol ||
    activity.security_symbol ||
    activity.security_name ||
    activity.security_id ||
    "UNKNOWN"
  );
}

export function sortActivities(activities = []) {
  return [...activities].sort((left, right) => {
    const leftDate = new Date(left?.date || 0).getTime();
    const rightDate = new Date(right?.date || 0).getTime();
    return leftDate - rightDate;
  });
}

export function calculatePortfolioMetrics(
  activities = [],
  { currentValue = null } = {}
) {
  const holdings = {};
  const sortedActivities = sortActivities(activities);
  const chartSnapshots = new Map();

  let totalCost = 0;
  let realisedGain = 0;
  let dividendIncome = 0;

  sortedActivities.forEach((activity) => {
    const symbol = getActivitySymbol(activity);
    const market = activity.market || activity.exchange || "OTHER";
    const currency = activity.currency || "AUD";
    const assetType =
      activity.asset_class || activity.security_type || activity.assetType || "Equity";
    const quantity = parseNumber(activity.quantity);
    const price = parseNumber(activity.price);
    const fees = parseNumber(activity.fees);
    const totalAmount =
      activity.total_amount !== undefined && activity.total_amount !== null
        ? parseNumber(activity.total_amount)
        : quantity * price;

    if (!holdings[symbol]) {
      holdings[symbol] = {
        symbol,
        quantity: 0,
        qty: 0,
        costBasis: 0,
        averagePrice: 0,
        market,
        currency,
        type: assetType,
        broker_id: activity.broker_id || "",
      };
    }

    const holding = holdings[symbol];
    holding.market = market;
    holding.currency = currency;
    holding.type = assetType;

    if (activity.type === "BUY") {
      holding.qty += quantity;
      holding.quantity = holding.qty;
      holding.costBasis += totalAmount + fees;
      holding.averagePrice =
        holding.qty > 0 ? holding.costBasis / Math.max(holding.qty, 1) : 0;
      totalCost += totalAmount + fees;
    }

    if (activity.type === "SELL") {
      const avgCost = holding.qty > 0 ? holding.costBasis / holding.qty : 0;
      holding.qty -= quantity;
      holding.quantity = holding.qty;
      holding.costBasis -= avgCost * quantity;
      holding.averagePrice =
        holding.qty > 0 ? holding.costBasis / Math.max(holding.qty, 1) : 0;
      realisedGain += totalAmount - fees - avgCost * quantity;
    }

    if (activity.type === "DIVIDEND") {
      dividendIncome += totalAmount;
    }

    if (holding.qty <= 0) {
      holding.qty = 0;
      holding.quantity = 0;
      holding.costBasis = Math.max(holding.costBasis, 0);
      holding.averagePrice = 0;
    }

    const marketBreakdown = {};
    let runningTotal = 0;

    Object.values(holdings).forEach((entry) => {
      if (entry.qty <= 0 || entry.costBasis <= 0) {
        return;
      }

      const value = entry.costBasis;
      marketBreakdown[entry.market] = (marketBreakdown[entry.market] || 0) + value;
      runningTotal += value;
    });

    const dateKey = toIsoDate(activity.date);
    chartSnapshots.set(dateKey, {
      date: dateKey,
      totalValue: Math.round(runningTotal * 100) / 100,
      ...marketBreakdown,
    });
  });

  const activeHoldings = Object.fromEntries(
    Object.entries(holdings).filter(([, value]) => value.qty > 0 || value.costBasis > 0)
  );

  const remainingCost = Object.values(activeHoldings).reduce(
    (sum, holding) => sum + Math.max(holding.costBasis, 0),
    0
  );

  const portfolioValue = currentValue ?? remainingCost;
  const unrealisedGain = portfolioValue - remainingCost;
  const capitalGain = unrealisedGain + realisedGain;

  const marketTotals = {};
  const currencyTotals = {};
  const securityTotals = {};
  const typeTotals = {};

  Object.entries(activeHoldings).forEach(([symbol, holding]) => {
    const value = Math.round(Math.max(holding.costBasis, 0) * 100) / 100;
    if (value <= 0) {
      return;
    }

    marketTotals[holding.market] = (marketTotals[holding.market] || 0) + value;
    currencyTotals[holding.currency] = (currencyTotals[holding.currency] || 0) + value;
    securityTotals[symbol] = value;
    typeTotals[holding.type] = (typeTotals[holding.type] || 0) + value;
  });

  const chartData = Array.from(chartSnapshots.values()).sort((left, right) =>
    left.date.localeCompare(right.date)
  );

  return {
    activities: sortedActivities,
    holdings: activeHoldings,
    chartData,
    totalCost,
    remainingCost,
    realisedGain,
    unrealisedGain,
    dividendIncome,
    capitalGain,
    portfolioValue,
    overallReturnPct:
      totalCost > 0 ? ((capitalGain + dividendIncome) / totalCost) * 100 : 0,
    markets: Object.keys(marketTotals),
    marketTotals,
    currencyTotals,
    securityTotals,
    typeTotals,
  };
}

export function buildPortfolioSnapshot(userId, activities = [], snapshotDate = new Date()) {
  const metrics = calculatePortfolioMetrics(activities);
  const date = toIsoDate(snapshotDate);

  return {
    user_id: userId,
    date,
    total_value: metrics.portfolioValue,
    total_cost: metrics.totalCost,
    total_gain: metrics.capitalGain,
    daily_change: null,
    cash_balance: 0,
    market_breakdown: metrics.marketTotals,
  };
}
