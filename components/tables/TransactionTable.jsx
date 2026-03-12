"use client";

import { useMemo, useState } from "react";
import { formatCurrencyFull, formatDisplayDate } from "@/lib/utils";

const PAGE_SIZES = [5, 10, 25, 50];

function typeClass(type) {
  if (type === "BUY") return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (type === "SELL") return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
}

export default function TransactionTable({
  transactions = [],
  onDelete,
  loading = false,
}) {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      typeFilter === "ALL" ? true : transaction.type === typeFilter
    );
  }, [transactions, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleDelete = async (id) => {
    if (!onDelete || !window.confirm("Delete this transaction?")) {
      return;
    }

    await onDelete(id);
  };

  if (loading) {
    return <div className="h-52 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-6 py-4 dark:border-slate-700/70">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transactions</h3>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="ALL">All types</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="DIVIDEND">DIVIDEND</option>
          </select>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-700/70">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60">
            <tr className="text-left text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Market</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Fees</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
            {paginatedTransactions.length ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${typeClass(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatDisplayDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{transaction.market || "-"}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{transaction.code}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{transaction.quantity || 0}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatCurrencyFull(Number(transaction.price || 0), transaction.currency || "AUD")}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatCurrencyFull(Number(transaction.fees || 0), transaction.currency || "AUD")}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{transaction.currency || "AUD"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatCurrencyFull(Number(transaction.total_amount || 0), transaction.currency || "AUD")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-sm font-medium text-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  No transactions match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200/80 px-6 py-4 text-sm dark:border-slate-700/70">
        <span className="text-slate-500 dark:text-slate-400">
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-xl border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
            className="rounded-xl border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
