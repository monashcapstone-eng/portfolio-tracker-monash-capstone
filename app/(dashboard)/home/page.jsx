"use client";

import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useBrokers } from "@/hooks/useBrokers";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/request";
import { formatCurrencyFull } from "@/lib/utils";
import KPISummaryCards from "@/components/dashboard/KPISummaryCards";
import PortfolioAreaChart from "@/components/dashboard/PortfolioAreaChart";
import BenchmarkChart from "@/components/charts/BenchmarkChart";
import TransactionTable from "@/components/tables/TransactionTable";
import BrokerCSVUploader from "@/components/upload/BrokerCSVUploader";
import AddTransactionForm from "@/components/forms/AddTransactionForm";
import Modal from "@/components/shared/Modal";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function HomePage() {
  const {
    activities,
    loading,
    error: activitiesError,
    addActivity,
    deleteActivity,
    fetchActivities,
  } = useActivities();
  const { brokers, error: brokersError } = useBrokers();
  const { getIdToken } = useAuth();
  const portfolio = usePortfolio(activities);
  const [activeTab, setActiveTab] = useState("transactions");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const pageError = activitiesError || brokersError;

  const securityOptions = useMemo(() => {
    const seen = new Set();
    return activities
      .filter((activity) => activity.code)
      .map((activity) => ({
        id: activity.security_id || activity.code,
        symbol: activity.code,
        name: activity.security_name || activity.name || activity.code,
        currency: activity.currency || "AUD",
      }))
      .filter((security) => {
        const key = `${security.symbol}-${security.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [activities]);

  const handleCreateTransaction = async (payload) => {
    try {
      setSaving(true);
      const token = await getIdToken();
      const security = await fetchJson("/api/securities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: payload.code,
          name: payload.name || payload.code,
          exchange: payload.market,
          currency: payload.currency,
        }),
      });

      await addActivity({
        ...payload,
        security_id: security.id,
      });
      await fetchActivities();
      setModalOpen(false);
    } catch (error) {
      console.error("Create transaction error:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    await deleteActivity(id);
    await fetchActivities();
  };

  return (
    <div className="space-y-6">
      <section className="surface-card overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Portfolio dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              See every broker, market, and return driver in one place.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Monitor portfolio value, compare against major benchmarks, and keep your activity log up to date with manual entries or broker CSV imports.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary/8 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-primary">Portfolio value</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {formatCurrencyFull(portfolio.portfolioValue || 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-800/80">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Open positions</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {Object.keys(portfolio.holdings).length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ErrorBanner message={pageError} />

      <KPISummaryCards
        activities={activities}
        loading={loading}
        currentValue={portfolio.portfolioValue}
      />

      <BenchmarkChart
        portfolioChartData={portfolio.chartData}
        loading={loading}
      />

      <PortfolioAreaChart
        chartData={portfolio.chartData}
        markets={portfolio.markets}
        loading={loading}
      />

      <section className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-6 py-4 dark:border-slate-700/70">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Activity workflows
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add transactions manually or import them from a broker CSV.
            </p>
          </div>
          {activeTab === "transactions" ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add transaction
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Upload className="h-4 w-4" />
              CSV import ready
            </div>
          )}
        </div>

        <div className="flex gap-2 px-6 py-4">
          {[
            { id: "transactions", label: "All Transactions" },
            { id: "import", label: "Import from CSV" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          {activeTab === "transactions" ? (
            <TransactionTable
              transactions={activities}
              loading={loading}
              onDelete={handleDeleteTransaction}
            />
          ) : (
            <BrokerCSVUploader onImported={fetchActivities} />
          )}
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add transaction"
        className="max-w-3xl"
      >
        <AddTransactionForm
          brokers={brokers}
          securityOptions={securityOptions}
          onSubmit={handleCreateTransaction}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
