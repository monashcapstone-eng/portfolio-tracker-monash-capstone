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
  const [sharePrice, setSharePrice] = useState("");
  const [annualDividend, setAnnualDividend] = useState("");
  const [shares, setShares] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const price = parseFloat(sharePrice);
    const dividend = parseFloat(annualDividend);
    const qty = parseFloat(shares);
    if (isNaN(price) || isNaN(dividend) || isNaN(qty) || price <= 0) return;

    const dividendYield = (dividend / price) * 100;
    const annualIncome = dividend * qty;
    const monthlyIncome = annualIncome / 12;

    setResult({ dividendYield, annualIncome, monthlyIncome });
  };

  return (
    <Card title="Dividend Calculator" description="Estimate your dividend income and yield based on current share price.">
      <Label text="Share Price (AUD)">
        <input type="number" className={field} value={sharePrice} onChange={(e) => setSharePrice(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Annual Dividend Per Share (AUD)">
        <input type="number" className={field} value={annualDividend} onChange={(e) => setAnnualDividend(e.target.value)} placeholder="0.00" />
      </Label>
      <Label text="Number of Shares">
        <input type="number" className={field} value={shares} onChange={(e) => setShares(e.target.value)} placeholder="0" />
      </Label>
      <button type="button" onClick={calculate} className={btnPrimary}>Calculate Dividends</button>
      {result && (
        <div className={resultBox}>
          <Row label="Dividend Yield" value={pct(result.dividendYield)} />
          <Row label="Annual Income" value={currency(result.annualIncome)} highlight />
          <Row label="Monthly Income" value={currency(result.monthlyIncome)} />
        </div>
      )}
    </Card>
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
