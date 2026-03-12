"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useActivities } from "@/hooks/useActivities";
import { useBrokers } from "@/hooks/useBrokers";
import BrokerCSVUploader from "@/components/upload/BrokerCSVUploader";
import TransactionTable from "@/components/tables/TransactionTable";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function BrokerDetailPage() {
  const params = useParams();
  const {
    activities,
    loading,
    error: activitiesError,
    deleteActivity,
    fetchActivities,
  } = useActivities();
  const { brokers, loading: brokersLoading, error: brokersError } = useBrokers();

  const broker = brokers.find((item) => item.id === params?.brokerId);
  const brokerActivities = useMemo(
    () => activities.filter((activity) => activity.broker_id === params?.brokerId),
    [activities, params?.brokerId]
  );
  const pageError = activitiesError || brokersError;

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Broker detail
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          {brokersLoading ? "Loading broker..." : broker?.name || "Broker not found"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Import broker-specific CSV files and inspect the activity history linked to this account.
        </p>
      </section>

      <ErrorBanner message={pageError} />

      <BrokerCSVUploader
        defaultBrokerName={broker?.name}
        onImported={fetchActivities}
      />

      <TransactionTable
        transactions={brokerActivities}
        loading={loading}
        onDelete={async (id) => {
          await deleteActivity(id);
          await fetchActivities();
        }}
      />
    </div>
  );
}
