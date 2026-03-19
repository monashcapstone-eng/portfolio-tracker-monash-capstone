"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ─── helpers ─── */
const currency = (v) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(v);

const pct = (v) => `${v.toFixed(2)}%`;

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

const btnPrimary =
  "w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity";

const resultBox =
  "mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60";

/* ─── Calculator Cards ─── */

function AustralianCGTCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("50000");
  const [salePrice, setSalePrice] = useState("85000");
  const [heldOver12Months, setHeldOver12Months] = useState(true);
  const [marginalRate, setMarginalRate] = useState("32.5");
  const [otherIncome, setOtherIncome] = useState("80000");

  const result = useMemo(() => {
    const buy = parseFloat(purchasePrice) || 0;
    const sell = parseFloat(salePrice) || 0;
    const rate = (parseFloat(marginalRate) || 0) / 100;
    if (buy <= 0 || sell <= 0) return null;

    const capitalGain = sell - buy;
    if (capitalGain <= 0) {
      return { capitalGain, taxableGain: 0, taxPayable: 0, discount: false, netProfit: capitalGain, effectiveRate: 0, breakdown: [] };
    }

    const discountApplied = heldOver12Months && capitalGain > 0;
    const taxableGain = discountApplied ? capitalGain * 0.5 : capitalGain;
    const taxPayable = taxableGain * rate;
    const netProfit = capitalGain - taxPayable;
    const effectiveRate = capitalGain > 0 ? (taxPayable / capitalGain) * 100 : 0;

    const breakdown = [
      { label: "Net Profit", value: netProfit, color: "#22c55e" },
      { label: "Tax Payable", value: taxPayable, color: "#ef4444" },
    ];
    if (discountApplied) {
      breakdown.push({ label: "CGT Discount Saved", value: capitalGain * 0.5 * rate, color: "#6366f1" });
    }

    const barData = [
      { name: "Purchase", value: buy, fill: "#94a3b8" },
      { name: "Sale", value: sell, fill: "#6366f1" },
    ];

    return { capitalGain, taxableGain, taxPayable, discount: discountApplied, netProfit, effectiveRate, breakdown, barData };
  }, [purchasePrice, salePrice, heldOver12Months, marginalRate]);

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left – Inputs */}
        <div className="space-y-5 border-b border-slate-200 p-6 dark:border-slate-700 lg:border-b-0 lg:border-r">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Australian CGT Calculator</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Calculate capital gains tax with the 50% CGT discount for assets held over 12 months.</p>
          </div>

          <Label text="Purchase price">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
            </div>
          </Label>

          <Label text="Sale price">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
            </div>
          </Label>

          <Label text="Marginal tax rate">
            <select className={field} value={marginalRate} onChange={(e) => setMarginalRate(e.target.value)}>
              <option value="0">0% – Tax-free threshold</option>
              <option value="19">19%</option>
              <option value="32.5">32.5%</option>
              <option value="37">37%</option>
              <option value="45">45%</option>
            </select>
          </Label>

          <Label text="Other taxable income (optional)">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} />
            </div>
          </Label>

          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Held for more than 12 months?</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="radio" name="cgt-held" checked={heldOver12Months} onChange={() => setHeldOver12Months(true)} className="accent-primary" /> Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="radio" name="cgt-held" checked={!heldOver12Months} onChange={() => setHeldOver12Months(false)} className="accent-primary" /> No
              </label>
            </div>
          </div>
        </div>

        {/* Right – Results */}
        <div className="p-6 space-y-6">
          {result ? (
            <>
              {/* Hero */}
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated tax payable</p>
                <p className={`mt-1 text-4xl font-bold ${result.taxPayable > 0 ? "text-red-500" : "text-green-500"}`}>{currency(result.taxPayable)}</p>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Capital Gain</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{currency(result.capitalGain)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Net Profit</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">{currency(result.netProfit)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Taxable Gain</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{currency(result.taxableGain)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Effective Tax Rate</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{pct(result.effectiveRate)}</p>
                </div>
              </div>

              {/* Discount badge */}
              {result.discount && (
                <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 dark:bg-indigo-900/20">
                  <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">50% CGT discount applied — you saved {currency(result.capitalGain * 0.5 * (parseFloat(marginalRate) / 100))}</span>
                </div>
              )}

              {/* Purchase vs Sale chart */}
              {result.barData && (
                <div>
                  <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Purchase vs Sale</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={result.barData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} tickLine={false} axisLine={false} width={70} />
                      <Tooltip formatter={(v) => [currency(v), "Value"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                        {result.barData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Breakdown */}
              {result.breakdown.length > 0 && (
                <div className="space-y-2">
                  <div className="flex h-4 overflow-hidden rounded-full">
                    {result.breakdown.map((seg) => {
                      const total = result.breakdown.reduce((s, b) => s + Math.abs(b.value), 0);
                      const widthPct = total > 0 ? (Math.abs(seg.value) / total) * 100 : 0;
                      return widthPct > 0 ? <div key={seg.label} style={{ width: `${widthPct}%`, backgroundColor: seg.color }} /> : null;
                    })}
                  </div>
                  {result.breakdown.map((seg) => {
                    const total = result.breakdown.reduce((s, b) => s + Math.abs(b.value), 0);
                    const segPct = total > 0 ? (Math.abs(seg.value) / total) * 100 : 0;
                    return (
                      <div key={seg.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                          <span className="text-slate-600 dark:text-slate-400">{seg.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-slate-900 dark:text-white">{currency(seg.value)}</span>
                          <span className="w-10 text-right text-slate-400">{Math.round(segPct)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Enter values to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvestmentCalculator() {
  const [principal, setPrincipal] = useState("400000");
  const [rate, setRate] = useState("10");
  const [contribFrequency, setContribFrequency] = useState("annually");
  const [contribution, setContribution] = useState("10000");
  const [target, setTarget] = useState("1000000");

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const contrib = parseFloat(contribution) || 0;
    const goalValue = parseFloat(target) || 0;

    if (p <= 0 || r <= 0 || goalValue <= 0) return null;

    const contribPerYear = contribFrequency === "monthly" ? contrib * 12
      : contribFrequency === "quarterly" ? contrib * 4
      : contrib;

    // Calculate time to reach target (in months for precision)
    let balance = p;
    let months = 0;
    const monthlyRate = r / 12;
    const monthlyContrib = contribPerYear / 12;
    const maxMonths = 100 * 12;

    while (balance < goalValue && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + monthlyContrib;
      months++;
    }

    const totalYears = Math.floor(months / 12);
    const remainingMonths = months % 12;

    // Build yearly data (up to 10 years for display)
    const displayYears = Math.min(totalYears + (remainingMonths > 0 ? 1 : 0), 10);
    const yearlyData = [];
    let runningBalance = p;

    for (let y = 1; y <= displayYears; y++) {
      for (let m = 0; m < 12; m++) {
        runningBalance = runningBalance * (1 + monthlyRate) + monthlyContrib;
      }
      yearlyData.push({
        year: y,
        name: `${y}`,
        value: runningBalance,
      });
    }

    const totalContributions = contribPerYear * totalYears + (contribPerYear / 12) * remainingMonths;
    const finalBalance = balance;
    const growthValue = finalBalance - p - totalContributions;

    const breakdown = [
      { label: "Contributions", value: totalContributions, color: "#f59e0b" },
      { label: "Growth", value: growthValue, color: "#f97316" },
      { label: "Principal", value: p, color: "#6366f1" },
    ];
    const totalValue = p + totalContributions + growthValue;

    return {
      totalYears,
      remainingMonths,
      totalContributions,
      growthValue,
      principal: p,
      totalValue,
      breakdown,
      yearlyData,
      displayYears,
      actualYears: totalYears + (remainingMonths > 0 ? 1 : 0),
    };
  }, [principal, rate, contribFrequency, contribution, target]);

  const timeLabel = result
    ? `${result.totalYears} year${result.totalYears !== 1 ? "s" : ""}${result.remainingMonths > 0 ? ` and ${result.remainingMonths} month${result.remainingMonths !== 1 ? "s" : ""}` : ""}`
    : "";

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left – Inputs */}
        <div className="space-y-5 border-b border-slate-200 p-6 dark:border-slate-700 lg:border-b-0 lg:border-r">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Investment Calculator</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Estimate how long it takes to reach your investment goal.</p>
          </div>

          <Label text="Initial investment value">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </div>
          </Label>

          <Label text="Annual return">
            <div className="relative">
              <input type="number" className={`${field} pr-8`} value={rate} onChange={(e) => setRate(e.target.value)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
            </div>
          </Label>

          <Label text="Contribution frequency">
            <select className={field} value={contribFrequency} onChange={(e) => setContribFrequency(e.target.value)}>
              <option value="annually">Annually</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
            </select>
          </Label>

          <Label text={`${contribFrequency === "monthly" ? "Monthly" : contribFrequency === "quarterly" ? "Quarterly" : "Annual"} contribution`}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={contribution} onChange={(e) => setContribution(e.target.value)} />
            </div>
          </Label>

          <Label text="Target investment value">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
          </Label>
        </div>

        {/* Right – Results */}
        <div className="p-6 space-y-6">
          {result ? (
            <>
              {/* Hero */}
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated number of years to achieve your goal</p>
                <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">{timeLabel}</p>
              </div>

              {/* Stacked bar */}
              <div className="flex h-4 overflow-hidden rounded-full">
                {result.breakdown.map((seg) => {
                  const widthPct = result.totalValue > 0 ? (seg.value / result.totalValue) * 100 : 0;
                  return widthPct > 0 ? (
                    <div key={seg.label} style={{ width: `${widthPct}%`, backgroundColor: seg.color }} />
                  ) : null;
                })}
              </div>

              {/* Breakdown legend */}
              <div className="space-y-2">
                {result.breakdown.map((seg) => {
                  const segPct = result.totalValue > 0 ? (seg.value / result.totalValue) * 100 : 0;
                  return (
                    <div key={seg.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-slate-600 dark:text-slate-400">{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-slate-900 dark:text-white">{currency(seg.value)}</span>
                        <span className="w-10 text-right text-slate-400">{Math.round(segPct)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar chart */}
              <div>
                <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio growth over the years</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={result.yearlyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : `$${v}`} width={60} />
                    <Tooltip formatter={(v) => [currency(v), "Portfolio Value"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {result.yearlyData.map((_, i) => (
                        <Cell key={i} fill="#6366f1" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Yearly table */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {result.yearlyData.map((row) => (
                  <div key={row.year} className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Year {row.year}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{currency(row.value)}</span>
                  </div>
                ))}
              </div>

              {/* Note */}
              {result.actualYears > 10 && (
                <p className="text-xs italic text-slate-400">
                  Note: Graph and table values are limited to a 10-year view. While your investment timeline may extend beyond this period, only the first 10 years of growth will be displayed. The calculated time to reach your target value remains accurate for the full investment period.
                </p>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Enter values to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AveragePriceCalculator() {
  const [entries, setEntries] = useState([
    { shares: "100", price: "5.20" },
    { shares: "150", price: "4.80" },
    { shares: "200", price: "5.50" },
  ]);
  const [currentPrice, setCurrentPrice] = useState("5.60");

  const updateEntry = (i, key, value) => {
    const next = [...entries];
    next[i] = { ...next[i], [key]: value };
    setEntries(next);
  };

  const addEntry = () => setEntries([...entries, { shares: "", price: "" }]);

  const removeEntry = (i) => {
    if (entries.length === 1) return;
    setEntries(entries.filter((_, idx) => idx !== i));
  };

  const result = useMemo(() => {
    let totalShares = 0;
    let totalCost = 0;
    const validEntries = [];

    for (const e of entries) {
      const s = parseFloat(e.shares);
      const p = parseFloat(e.price);
      if (isNaN(s) || isNaN(p) || s <= 0 || p <= 0) continue;
      totalShares += s;
      totalCost += s * p;
      validEntries.push({ shares: s, price: p, cost: s * p });
    }

    if (totalShares === 0) return null;

    const avgPrice = totalCost / totalShares;
    const mktPrice = parseFloat(currentPrice) || 0;
    const currentValue = mktPrice > 0 ? totalShares * mktPrice : 0;
    const unrealisedPL = mktPrice > 0 ? currentValue - totalCost : 0;
    const unrealisedPLPct = totalCost > 0 && mktPrice > 0 ? (unrealisedPL / totalCost) * 100 : 0;

    // Running average data for chart
    let runningShares = 0;
    let runningCost = 0;
    const chartData = validEntries.map((e, i) => {
      runningShares += e.shares;
      runningCost += e.cost;
      return { name: `Buy ${i + 1}`, avg: runningCost / runningShares, shares: runningShares };
    });

    // Pie data for cost weight
    const pieData = validEntries.map((e, i) => ({
      name: `Buy ${i + 1}`,
      value: e.cost,
    }));

    const PIE_COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

    return { avgPrice, totalShares, totalCost, currentValue, unrealisedPL, unrealisedPLPct, chartData, pieData, validEntries, PIE_COLORS };
  }, [entries, currentPrice]);

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left – Inputs */}
        <div className="space-y-5 border-b border-slate-200 p-6 dark:border-slate-700 lg:border-b-0 lg:border-r">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Average Price Calculator</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Calculate the weighted average purchase price across multiple buy orders.</p>
          </div>

          {entries.map((entry, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Purchase #{i + 1}</span>
                {entries.length > 1 && (
                  <button type="button" onClick={() => removeEntry(i)} className="text-xs font-medium text-red-500 hover:text-red-600">Remove</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Label text="Shares">
                  <input type="number" className={field} value={entry.shares} onChange={(e) => updateEntry(i, "shares", e.target.value)} placeholder="Qty" />
                </Label>
                <Label text="Price per share">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                    <input type="number" className={`${field} pl-8`} value={entry.price} onChange={(e) => updateEntry(i, "price", e.target.value)} placeholder="0.00" />
                  </div>
                </Label>
              </div>
            </div>
          ))}

          <button type="button" onClick={addEntry} className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-sm font-medium text-primary hover:border-primary/40 dark:border-slate-700">
            + Add another purchase
          </button>

          <Label text="Current market price (optional)">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} placeholder="0.00" />
            </div>
          </Label>
        </div>

        {/* Right – Results */}
        <div className="p-6 space-y-6">
          {result ? (
            <>
              {/* Hero */}
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Weighted average price</p>
                <p className="mt-1 text-4xl font-bold text-primary">{currency(result.avgPrice)}</p>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Total Shares</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{result.totalShares.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Total Cost</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{currency(result.totalCost)}</p>
                </div>
                {result.currentValue > 0 && (
                  <>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Current Value</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{currency(result.currentValue)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Unrealised P&L</p>
                      <p className={`mt-1 text-lg font-semibold ${result.unrealisedPL >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {currency(result.unrealisedPL)} ({result.unrealisedPLPct >= 0 ? "+" : ""}{result.unrealisedPLPct.toFixed(2)}%)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Average price progression chart */}
              <div>
                <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Average price after each purchase</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={result.chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} width={55} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                    <Tooltip formatter={(v) => [currency(v), "Avg Price"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
                    <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                      {result.chartData.map((_, i) => (
                        <Cell key={i} fill="#6366f1" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Cost allocation pie */}
              <div>
                <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Cost allocation by purchase</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={result.pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {result.pieData.map((_, i) => (
                        <Cell key={i} fill={result.PIE_COLORS[i % result.PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [currency(v), "Cost"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {result.pieData.map((seg, i) => (
                    <div key={seg.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: result.PIE_COLORS[i % result.PIE_COLORS.length] }} />
                      {seg.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase table */}
              <div className="space-y-1 text-sm">
                {result.validEntries.map((e, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Buy {i + 1}: {e.shares} @ {currency(e.price)}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{currency(e.cost)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Enter values to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CAGRCalculator() {
  const [beginValue, setBeginValue] = useState("50000");
  const [endValue, setEndValue] = useState("120000");
  const [years, setYears] = useState("7");

  const result = useMemo(() => {
    const bv = parseFloat(beginValue) || 0;
    const ev = parseFloat(endValue) || 0;
    const t = parseFloat(years) || 0;
    if (bv <= 0 || ev <= 0 || t <= 0) return null;

    const cagr = (Math.pow(ev / bv, 1 / t) - 1) * 100;
    const totalReturn = ((ev - bv) / bv) * 100;
    const absoluteGain = ev - bv;

    // Growth curve data
    const growthData = [];
    for (let y = 0; y <= t; y++) {
      growthData.push({
        year: y,
        name: `${y}`,
        value: bv * Math.pow(1 + cagr / 100, y),
      });
    }

    // What-if: compare different rates
    const compareRates = [5, 7, 10, 12, 15].filter((r) => Math.abs(r - cagr) > 0.5);
    const comparisonData = compareRates.map((r) => ({
      rate: r,
      finalValue: bv * Math.pow(1 + r / 100, t),
    }));

    // Doubling time (Rule of 72 actual)
    const doublingTime = cagr > 0 ? Math.log(2) / Math.log(1 + cagr / 100) : 0;

    return { cagr, totalReturn, absoluteGain, growthData, comparisonData, doublingTime, bv, ev };
  }, [beginValue, endValue, years]);

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left – Inputs */}
        <div className="space-y-5 border-b border-slate-200 p-6 dark:border-slate-700 lg:border-b-0 lg:border-r">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">CAGR Calculator</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Determine the Compound Annual Growth Rate of an investment over time.</p>
          </div>

          <Label text="Beginning value">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={beginValue} onChange={(e) => setBeginValue(e.target.value)} />
            </div>
          </Label>

          <Label text="Ending value">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={endValue} onChange={(e) => setEndValue(e.target.value)} />
            </div>
          </Label>

          <Label text="Number of years">
            <select className={field} value={years} onChange={(e) => setYears(e.target.value)}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} year{y > 1 ? "s" : ""}</option>
              ))}
            </select>
          </Label>
        </div>

        {/* Right – Results */}
        <div className="p-6 space-y-6">
          {result ? (
            <>
              {/* Hero */}
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Compound Annual Growth Rate</p>
                <p className={`mt-1 text-4xl font-bold ${result.cagr >= 0 ? "text-green-600" : "text-red-500"}`}>{pct(result.cagr)}</p>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Total Return</p>
                  <p className={`mt-1 text-lg font-semibold ${result.totalReturn >= 0 ? "text-green-600" : "text-red-500"}`}>{pct(result.totalReturn)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Absolute Gain</p>
                  <p className={`mt-1 text-lg font-semibold ${result.absoluteGain >= 0 ? "text-green-600" : "text-red-500"}`}>{currency(result.absoluteGain)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Doubling Time</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{result.doublingTime > 0 ? `${result.doublingTime.toFixed(1)} yrs` : "N/A"}</p>
                </div>
              </div>

              {/* Growth curve */}
              <div>
                <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Growth trajectory</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={result.growthData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : `$${v}`} width={55} />
                    <Tooltip formatter={(v) => [currency(v), "Value"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stacked bar */}
              <div className="space-y-2">
                <div className="flex h-4 overflow-hidden rounded-full">
                  <div style={{ width: `${(result.bv / result.ev) * 100}%`, backgroundColor: "#6366f1" }} />
                  <div style={{ width: `${(result.absoluteGain / result.ev) * 100}%`, backgroundColor: "#22c55e" }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-indigo-500" />
                    <span className="text-slate-600 dark:text-slate-400">Initial Investment</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{currency(result.bv)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-slate-600 dark:text-slate-400">Growth</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{currency(result.absoluteGain)}</span>
                </div>
              </div>

              {/* Comparison table */}
              {result.comparisonData.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">What if your CAGR was different?</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between border-b border-primary/20 py-2">
                      <span className="font-medium text-primary">{pct(result.cagr)} (Actual)</span>
                      <span className="font-semibold text-primary">{currency(result.ev)}</span>
                    </div>
                    {result.comparisonData.map((c) => (
                      <div key={c.rate} className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">{c.rate}%</span>
                        <span className="font-medium text-slate-900 dark:text-white">{currency(c.finalValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Year-by-year table */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {result.growthData.map((row) => (
                  <div key={row.year} className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Year {row.year}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{currency(row.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Enter values to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DividendCalculator() {
  const [sharePrice, setSharePrice] = useState("100");
  const [numShares, setNumShares] = useState("100");
  const [holdingPeriod, setHoldingPeriod] = useState("10");
  const [dividendYield, setDividendYield] = useState("5");
  const [annualContribution, setAnnualContribution] = useState("1000");
  const [drip, setDrip] = useState(false);
  const [stockAppreciation, setStockAppreciation] = useState("2");
  const [dividendGrowth, setDividendGrowth] = useState("2");

  const result = useMemo(() => {
    const price = parseFloat(sharePrice) || 0;
    const shares = parseFloat(numShares) || 0;
    const years = parseInt(holdingPeriod) || 0;
    const dy = (parseFloat(dividendYield) || 0) / 100;
    const contrib = parseFloat(annualContribution) || 0;
    const appreciation = (parseFloat(stockAppreciation) || 0) / 100;
    const divGrowth = (parseFloat(dividendGrowth) || 0) / 100;

    if (price <= 0 || shares <= 0 || years <= 0) return null;

    let currentShares = shares;
    let currentPrice = price;
    let currentDivPerShare = price * dy;
    let totalDividends = 0;
    let totalContributions = 0;
    const yearlyData = [];

    for (let y = 1; y <= years; y++) {
      const annualDiv = currentShares * currentDivPerShare;
      totalDividends += annualDiv;

      if (drip) {
        currentShares += annualDiv / currentPrice;
      }

      totalContributions += contrib;
      currentShares += contrib / currentPrice;

      yearlyData.push({
        year: y,
        name: `${y}`,
        monthlyIncome: annualDiv / 12,
      });

      currentPrice *= (1 + appreciation);
      currentDivPerShare *= (1 + divGrowth);
    }

    const principal = price * shares;
    const growthValue = (currentPrice - price) * shares;
    const totalValue = totalDividends + totalContributions + growthValue + principal;

    return {
      totalDividends,
      totalContributions,
      growthValue,
      principal,
      totalValue,
      yearlyData,
      breakdown: [
        { label: "Dividends", value: totalDividends, color: "#f59e0b" },
        { label: "Contributions", value: totalContributions, color: "#f97316" },
        { label: "Growth", value: growthValue, color: "#6366f1" },
        { label: "Principal", value: principal, color: "#c7d2fe" },
      ],
    };
  }, [sharePrice, numShares, holdingPeriod, dividendYield, annualContribution, drip, stockAppreciation, dividendGrowth]);

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left – Inputs */}
        <div className="space-y-5 border-b border-slate-200 p-6 dark:border-slate-700 lg:border-b-0 lg:border-r">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Dividend Calculator</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Estimate your dividend income over time with reinvestment and growth.</p>
          </div>

          <Label text="Unit/share price">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={sharePrice} onChange={(e) => setSharePrice(e.target.value)} />
            </div>
          </Label>

          <Label text="Number of shares">
            <input type="number" className={field} value={numShares} onChange={(e) => setNumShares(e.target.value)} />
          </Label>

          <Label text="Holding period">
            <select className={field} value={holdingPeriod} onChange={(e) => setHoldingPeriod(e.target.value)}>
              {[1, 2, 3, 5, 7, 10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} year{y > 1 ? "s" : ""}</option>
              ))}
            </select>
          </Label>

          <Label text="Annual dividend yield">
            <div className="relative">
              <input type="number" className={`${field} pr-8`} value={dividendYield} onChange={(e) => setDividendYield(e.target.value)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
            </div>
          </Label>

          <Label text="Annual contribution">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" className={`${field} pl-8`} value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} />
            </div>
          </Label>

          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dividend reinvestment plan</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="radio" name="drip" checked={drip} onChange={() => setDrip(true)} className="accent-primary" /> Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="radio" name="drip" checked={!drip} onChange={() => setDrip(false)} className="accent-primary" /> No
              </label>
            </div>
          </div>

          <Label text="Expected annual stock appreciation">
            <div className="relative">
              <input type="number" className={`${field} pr-8`} value={stockAppreciation} onChange={(e) => setStockAppreciation(e.target.value)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
            </div>
          </Label>

          <Label text="Expected dividend growth rate">
            <div className="relative">
              <input type="number" className={`${field} pr-8`} value={dividendGrowth} onChange={(e) => setDividendGrowth(e.target.value)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
            </div>
          </Label>
        </div>

        {/* Right – Results */}
        <div className="p-6 space-y-6">
          {result ? (
            <>
              {/* Hero number */}
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated dividend return</p>
                <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">{currency(result.totalDividends)}</p>
              </div>

              {/* Stacked bar */}
              <div className="flex h-4 overflow-hidden rounded-full">
                {result.breakdown.map((seg) => {
                  const widthPct = result.totalValue > 0 ? (seg.value / result.totalValue) * 100 : 0;
                  return widthPct > 0 ? (
                    <div key={seg.label} style={{ width: `${widthPct}%`, backgroundColor: seg.color }} />
                  ) : null;
                })}
              </div>

              {/* Breakdown legend */}
              <div className="space-y-2">
                {result.breakdown.map((seg) => {
                  const segPct = result.totalValue > 0 ? (seg.value / result.totalValue) * 100 : 0;
                  return (
                    <div key={seg.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-slate-600 dark:text-slate-400">{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-slate-900 dark:text-white">{currency(seg.value)}</span>
                        <span className="w-10 text-right text-slate-400">{Math.round(segPct)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar chart */}
              <div>
                <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Average monthly income</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={result.yearlyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${Math.round(v)}`} width={50} />
                    <Tooltip formatter={(v) => [currency(v), "Monthly Income"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
                    <Bar dataKey="monthlyIncome" radius={[4, 4, 0, 0]}>
                      {result.yearlyData.map((_, i) => (
                        <Cell key={i} fill="#6366f1" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Yearly table */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {result.yearlyData.map((row) => (
                  <div key={row.year} className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Year {row.year}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{currency(row.monthlyIncome)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Enter values to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared UI pieces ─── */

function Card({ title, description, children }) {
  return (
    <div className="surface-card p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Label({ text, className, children }) {
  return (
    <label className={`block space-y-1 ${className || ""}`}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</span>
      {children}
    </label>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : "font-medium text-slate-900 dark:text-white"}>
        {value}
      </span>
    </div>
  );
}

/* ─── Page ─── */

const calculators = [
  { id: "cgt", label: "Australian CGT" },
  { id: "investment", label: "Investment" },
  { id: "average", label: "Average Price" },
  { id: "cagr", label: "CAGR" },
  { id: "dividend", label: "Dividend" },
];

export default function CalculatorsPage() {
  const [active, setActive] = useState("cgt");

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Calculators
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
            Investment & tax calculators
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Quickly crunch numbers for capital gains tax, compound growth, average costs, and dividend income.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            type="button"
            onClick={() => setActive(calc.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === calc.id
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {calc.label}
          </button>
        ))}
      </div>

      {active === "cgt" && <AustralianCGTCalculator />}
      {active === "investment" && <InvestmentCalculator />}
      {active === "average" && <AveragePriceCalculator />}
      {active === "cagr" && <CAGRCalculator />}
      {active === "dividend" && <DividendCalculator />}
    </div>
  );
}
