"use client";

import { useEffect, useMemo, useState } from "react";

const MARKET_OPTIONS = ["ASX", "NASDAQ", "NYSE", "LSE", "TSX", "OTHER"];
const TYPE_OPTIONS = ["BUY", "SELL", "DIVIDEND"];

const EMPTY_FORM = {
  type: "BUY",
  date: new Date().toISOString().split("T")[0],
  market: "ASX",
  broker_id: "",
  code: "",
  name: "",
  currency: "AUD",
  quantity: "1",
  price: "",
  fees: "0",
  notes: "",
};

export default function AddTransactionForm({
  brokers = [],
  securityOptions = [],
  initialValues = EMPTY_FORM,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const isDividend = form.type === "DIVIDEND";

  const suggestions = useMemo(() => {
    return securityOptions.slice(0, 20);
  }, [securityOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCodeBlur = () => {
    if (!form.code) {
      return;
    }

    const matchedSecurity = suggestions.find(
      (item) => item.symbol?.toLowerCase() === form.code.toLowerCase()
    );

    if (matchedSecurity) {
      setForm((current) => ({
        ...current,
        name: current.name || matchedSecurity.name || "",
        currency: current.currency || matchedSecurity.currency || "AUD",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.type || !form.date || !form.code.trim()) {
      setError("Type, date, and code are required.");
      return;
    }

    if (!isDividend && (!Number(form.quantity) || !Number(form.price))) {
      setError("Quantity and price are required for buy and sell transactions.");
      return;
    }

    if (Number(form.fees) < 0) {
      setError("Fees must be zero or greater.");
      return;
    }

    const quantity = isDividend ? 0 : Number(form.quantity);
    const price = Number(form.price || 0);
    const fees = isDividend ? 0 : Number(form.fees || 0);
    const totalAmount = isDividend ? price : quantity * price;

    setError("");
    await onSubmit({
      ...form,
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      quantity,
      price,
      fees,
      total_amount: totalAmount,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Market
          </label>
          <select
            name="market"
            value={form.market}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {MARKET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Broker
          </label>
          <select
            name="broker_id"
            value={form.broker_id}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Unassigned</option>
            {brokers.map((broker) => (
              <option key={broker.id} value={broker.id}>
                {broker.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Code
          </label>
          <input
            list="security-codes"
            name="code"
            value={form.code}
            onChange={handleChange}
            onBlur={handleCodeBlur}
            placeholder="BHP"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
          <datalist id="security-codes">
            {suggestions.map((option) => (
              <option key={option.id || option.symbol} value={option.symbol}>
                {option.name}
              </option>
            ))}
          </datalist>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Security name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="BHP Group"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Currency
          </label>
          <input
            name="currency"
            value={form.currency}
            onChange={handleChange}
            placeholder="AUD"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {isDividend ? "Dividend amount" : "Quantity"}
          </label>
          <input
            type="number"
            name="quantity"
            value={isDividend ? "0" : form.quantity}
            onChange={handleChange}
            disabled={isDividend}
            min="0"
            step="0.0001"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {isDividend ? "Payment amount" : "Price"}
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.0001"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Fees
          </label>
          <input
            type="number"
            name="fees"
            value={isDividend ? "0" : form.fees}
            onChange={handleChange}
            disabled={isDividend}
            min="0"
            step="0.01"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Notes
          </label>
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save transaction"}
        </button>
      </div>
    </form>
  );
}
