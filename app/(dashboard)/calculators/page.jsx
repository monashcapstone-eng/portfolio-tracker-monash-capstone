"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [heldOver12Months, setHeldOver12Months] = useState(true);
  const [marginalRate, setMarginalRate] = useState("32.5");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const buy = parseFloat(purchasePrice);
    const sell = parseFloat(salePrice);
    const rate = parseFloat(marginalRate) / 100;
    if (isNaN(buy) || isNaN(sell) || isNaN(rate)) return;

    const capitalGain = sell - buy;
    const taxableGain = capitalGain > 0 && heldOver12Months ? capitalGain * 0.5 : capitalGain;
    const taxPayable = taxableGain > 0 ? taxableGain * rate : 0;

    setResult({ capitalGain, taxableGain, taxPayable, discount: heldOver12Months && capitalGain > 0 });
  };

  return (
    <Card title="Australian CGT Calculator" description="Calculate capital gains tax with the 50% CGT discount for assets held over 12 months.">
      <Label text="Purchase Price (AUD)">
        <input type="number" className={field} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Sale Price (AUD)">
        <input type="number" className={field} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Marginal Tax Rate (%)">
        <select className={field} value={marginalRate} onChange={(e) => setMarginalRate(e.target.value)}>
          <option value="0">0% – Tax-free threshold</option>
          <option value="19">19%</option>
          <option value="32.5">32.5%</option>
          <option value="37">37%</option>
          <option value="45">45%</option>
        </select>
      </Label>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" checked={heldOver12Months} onChange={(e) => setHeldOver12Months(e.target.checked)} className="rounded border-slate-300" />
        Held for more than 12 months
      </label>
      <button type="button" onClick={calculate} className={btnPrimary}>Calculate CGT</button>
      {result && (
        <div className={resultBox}>
          <Row label="Capital Gain" value={currency(result.capitalGain)} />
          {result.discount && <Row label="50% CGT Discount Applied" value="Yes" />}
          <Row label="Taxable Gain" value={currency(result.taxableGain)} />
          <Row label="Estimated Tax Payable" value={currency(result.taxPayable)} highlight />
        </div>
      )}
    </Card>
  );
}

function InvestmentCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const m = parseFloat(monthlyContribution) || 0;
    if (isNaN(p) || isNaN(r) || isNaN(t)) return;

    const monthlyRate = r / 12;
    const months = t * 12;
    const compoundedPrincipal = p * Math.pow(1 + monthlyRate, months);
    const compoundedContributions = m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const futureValue = compoundedPrincipal + (m > 0 ? compoundedContributions : 0);
    const totalContributed = p + m * months;
    const totalInterest = futureValue - totalContributed;

    setResult({ futureValue, totalContributed, totalInterest });
  };

  return (
    <Card title="Investment Calculator" description="Project the future value of an investment with regular contributions and compound interest.">
      <Label text="Initial Investment (AUD)">
        <input type="number" className={field} value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Annual Return Rate (%)">
        <input type="number" className={field} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="7" />
      </Label>
      <Label text="Investment Period (Years)">
        <input type="number" className={field} value={years} onChange={(e) => setYears(e.target.value)} placeholder="10" />
      </Label>
      <Label text="Monthly Contribution (AUD)">
        <input type="number" className={field} value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} placeholder="0.00" />
      </Label>
      <button type="button" onClick={calculate} className={btnPrimary}>Calculate</button>
      {result && (
        <div className={resultBox}>
          <Row label="Future Value" value={currency(result.futureValue)} highlight />
          <Row label="Total Contributed" value={currency(result.totalContributed)} />
          <Row label="Total Interest Earned" value={currency(result.totalInterest)} />
        </div>
      )}
    </Card>
  );
}

function AveragePriceCalculator() {
  const [entries, setEntries] = useState([{ shares: "", price: "" }]);
  const [result, setResult] = useState(null);

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

  const calculate = () => {
    let totalShares = 0;
    let totalCost = 0;
    for (const e of entries) {
      const s = parseFloat(e.shares);
      const p = parseFloat(e.price);
      if (isNaN(s) || isNaN(p)) return;
      totalShares += s;
      totalCost += s * p;
    }
    if (totalShares === 0) return;
    setResult({ avgPrice: totalCost / totalShares, totalShares, totalCost });
  };

  return (
    <Card title="Average Price Calculator" description="Calculate the weighted average purchase price across multiple buy orders.">
      {entries.map((entry, i) => (
        <div key={i} className="flex items-end gap-2">
          <Label text={`Shares #${i + 1}`} className="flex-1">
            <input type="number" className={field} value={entry.shares} onChange={(e) => updateEntry(i, "shares", e.target.value)} placeholder="Qty" />
          </Label>
          <Label text="Price" className="flex-1">
            <input type="number" className={field} value={entry.price} onChange={(e) => updateEntry(i, "price", e.target.value)} placeholder="0.00" />
          </Label>
          {entries.length > 1 && (
            <button type="button" onClick={() => removeEntry(i)} className="mb-0.5 rounded-lg p-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20">
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addEntry} className="text-sm font-medium text-primary">
        + Add another purchase
      </button>
      <button type="button" onClick={calculate} className={btnPrimary}>Calculate Average</button>
      {result && (
        <div className={resultBox}>
          <Row label="Average Price" value={currency(result.avgPrice)} highlight />
          <Row label="Total Shares" value={result.totalShares.toLocaleString()} />
          <Row label="Total Cost" value={currency(result.totalCost)} />
        </div>
      )}
    </Card>
  );
}

function CAGRCalculator() {
  const [beginValue, setBeginValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const bv = parseFloat(beginValue);
    const ev = parseFloat(endValue);
    const t = parseFloat(years);
    if (isNaN(bv) || isNaN(ev) || isNaN(t) || bv <= 0 || t <= 0) return;

    const cagr = (Math.pow(ev / bv, 1 / t) - 1) * 100;
    setResult({ cagr, totalReturn: ((ev - bv) / bv) * 100 });
  };

  return (
    <Card title="CAGR Calculator" description="Determine the Compound Annual Growth Rate of an investment over time.">
      <Label text="Beginning Value (AUD)">
        <input type="number" className={field} value={beginValue} onChange={(e) => setBeginValue(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Ending Value (AUD)">
        <input type="number" className={field} value={endValue} onChange={(e) => setEndValue(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Number of Years">
        <input type="number" className={field} value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" />
      </Label>
      <button type="button" onClick={calculate} className={btnPrimary}>Calculate CAGR</button>
      {result && (
        <div className={resultBox}>
          <Row label="CAGR" value={pct(result.cagr)} highlight />
          <Row label="Total Return" value={pct(result.totalReturn)} />
        </div>
      )}
    </Card>
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
