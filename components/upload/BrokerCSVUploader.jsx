"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { useAuth } from "@/context/AuthContext";
import { formatDate, parseNumber } from "@/lib/utils";

const BROKER_OPTIONS = [
  { value: "hsbc", label: "HSBC Australia" },
  { value: "180_markets", label: "180 Markets" },
  { value: "708_wealth", label: "708 Wealth" },
  { value: "alpine_capital", label: "Alpine Capital" },
  { value: "asr_wealth", label: "ASR Wealth" },
  { value: "sharesight", label: "Sharesight" },
];

function normaliseType(value = "") {
  const token = value.toUpperCase().trim();

  if (["BUY", "B"].includes(token)) return "BUY";
  if (["SELL", "S"].includes(token)) return "SELL";
  if (["DIVIDEND", "DIV", "DISTRIBUTION"].includes(token)) return "DIVIDEND";

  return token || "BUY";
}

function inferMarket(value = "") {
  const token = value.toUpperCase().trim();
  if (!token) return "ASX";
  if (["NASDAQ", "NYSE", "LSE", "TSX", "ASX"].includes(token)) return token;
  return token;
}

function mapStandardRow(row, brokerType) {
  return {
    code: String(row["Code"] || "").trim().toUpperCase(),
    name: String(row["Security Name"] || row["Stock Name"] || row["Code"] || "").trim(),
    market: inferMarket(row["Market"] || row["Market Code"]),
    currency: String(
      row["Instrument Currency"] || row["Currency"] || row["Brokerage Currency"] || "AUD"
    )
      .trim()
      .toUpperCase(),
    date: formatDate(row["Date"] || row["Trade Date"]),
    type: normaliseType(row["Type"] || row["Transaction Type"]),
    quantity: parseNumber(row["Quantity"]),
    price: parseNumber(row["Price"]),
    fees: parseNumber(row["Brokerage"]),
    total_amount: parseNumber(row["Total Amount"]) || parseNumber(row["Quantity"]) * parseNumber(row["Price"]),
    notes: String(row["Comments"] || row["Comment"] || "").trim(),
    broker_label: BROKER_OPTIONS.find((option) => option.value === brokerType)?.label,
  };
}

function mapBrokerRow(row, brokerType) {
  if (brokerType === "hsbc") {
    return {
      code: String(row["Stock Code"] || "").trim().toUpperCase(),
      name: String(row["Stock Name"] || row["Stock Code"] || "").trim(),
      market: inferMarket(row["Market Code"] || "ASX"),
      currency: "AUD",
      date: formatDate(row["Transaction Date"]),
      type: normaliseType(row["Transaction Type"]),
      quantity: parseNumber(row["Quantity"]),
      price: parseNumber(row["Price per Share"]),
      fees: parseNumber(row["Brokerage"]),
      total_amount:
        parseNumber(row["Total Amount"]) ||
        parseNumber(row["Quantity"]) * parseNumber(row["Price per Share"]),
      notes: String(row["Comments"] || row["Contract Note Number"] || "").trim(),
      broker_label: "HSBC Australia",
    };
  }

  if (brokerType === "sharesight") {
    return {
      code: String(row["Code"] || "").trim().toUpperCase(),
      name: String(row["Security Name"] || "").trim(),
      market: inferMarket(row["Market"]),
      currency: String(row["Currency"] || "AUD").trim().toUpperCase(),
      date: formatDate(row["Trade Date"]),
      type: normaliseType(row["Transaction Type"]),
      quantity: parseNumber(row["Quantity"]),
      price: parseNumber(row["Price"]),
      fees: parseNumber(row["Brokerage"]),
      total_amount: parseNumber(row["Quantity"]) * parseNumber(row["Price"]),
      notes: "",
      broker_label: "Sharesight",
    };
  }

  return mapStandardRow(row, brokerType);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export default function BrokerCSVUploader({
  defaultBrokerName = "",
  onImported,
}) {
  const { getIdToken } = useAuth();
  const [brokerType, setBrokerType] = useState("hsbc");
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setError("");
    setSuccess("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const mappedRows = results.data
            .map((row) => mapBrokerRow(row, brokerType))
            .filter((row) => row.code && row.date && row.type);

          setRows(mappedRows);
        } catch (parseError) {
          console.error("CSV parse error:", parseError);
          setError("Unable to parse this CSV format.");
        }
      },
      error: (parseError) => {
        console.error("CSV parse error:", parseError);
        setError("Unable to read the selected CSV file.");
      },
    });
  };

  const handleImport = async () => {
    if (!rows.length) {
      setError("Select a valid CSV file first.");
      return;
    }

    try {
      setImporting(true);
      setError("");
      setSuccess("");

      const token = await getIdToken();
      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const brokerName =
        defaultBrokerName ||
        BROKER_OPTIONS.find((option) => option.value === brokerType)?.label ||
        "Imported Broker";

      const brokers = await requestJson("/api/brokers", { headers: authHeaders });
      const existingBroker = brokers.find(
        (broker) => broker.name?.trim().toLowerCase() === brokerName.trim().toLowerCase()
      );

      const broker =
        existingBroker ||
        (await requestJson("/api/brokers", {
          method: "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: brokerName, description: `Imported via ${brokerName} CSV` }),
        }));

      for (const row of rows) {
        const security = await requestJson("/api/securities", {
          method: "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: row.code,
            name: row.name || row.code,
            exchange: row.market,
            currency: row.currency,
          }),
        });

        await requestJson("/api/activities", {
          method: "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...row,
            broker_id: broker.id,
            security_id: security.id,
          }),
        });
      }

      setSuccess(`Imported ${rows.length} transactions from ${fileName}.`);
      if (onImported) {
        await onImported();
      }
    } catch (importError) {
      console.error("CSV import error:", importError);
      setError(importError.message || "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="surface-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Import broker CSV
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Supports HSBC, Sharesight, 180 Markets, 708 Wealth, Alpine Capital, and ASR Wealth.
          </p>
        </div>
        <a
          href="/samples/hsbc.csv"
          className="text-sm font-medium text-primary"
        >
          Download sample CSV
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <select
          value={brokerType}
          onChange={(event) => {
            setBrokerType(event.target.value);
            setRows([]);
            setSuccess("");
            setError("");
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          {BROKER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="block w-full rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white dark:border-slate-700 dark:bg-slate-950"
        />
      </div>

      {previewRows.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-700/70">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60">
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Code</th>
                <th className="px-3 py-2 font-medium">Quantity</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
              {previewRows.map((row, index) => (
                <tr key={`${row.code}-${row.date}-${index}`}>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.date}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.type}</td>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{row.code}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.quantity}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.price}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Previewing the first 5 mapped rows. Import will process {rows.length} rows.
          </p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-success">{success}</p> : null}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleImport}
          disabled={importing || !rows.length}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {importing ? "Importing..." : "Confirm import"}
        </button>
      </div>
    </div>
  );
}
