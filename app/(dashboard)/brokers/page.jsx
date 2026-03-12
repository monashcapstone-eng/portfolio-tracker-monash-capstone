"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useBrokers } from "@/hooks/useBrokers";
import AddBrokerForm from "@/components/forms/AddBrokerForm";
import Modal from "@/components/shared/Modal";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function BrokersPage() {
  const { activities, error: activitiesError } = useActivities();
  const {
    brokers,
    loading,
    error: brokersError,
    createBroker,
    updateBroker,
    deleteBroker,
  } = useBrokers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState(null);
  const [saving, setSaving] = useState(false);
  const pageError = brokersError || activitiesError;

  const activityCounts = useMemo(() => {
    return activities.reduce((counts, activity) => {
      if (!activity.broker_id) return counts;
      counts[activity.broker_id] = (counts[activity.broker_id] || 0) + 1;
      return counts;
    }, {});
  }, [activities]);

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      if (editingBroker) {
        await updateBroker(editingBroker.id, payload);
      } else {
        await createBroker(payload);
      }
      setModalOpen(false);
      setEditingBroker(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this broker?")) {
      return;
    }

    await deleteBroker(id);
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Brokers
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
              Manage connected broker accounts
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Keep each broker workspace organised so imports and manual trades land in the right account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingBroker(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add broker
          </button>
        </div>
      </section>

      <ErrorBanner message={pageError} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))
        ) : brokers.length ? (
          brokers.map((broker) => (
            <div key={broker.id} className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-primary">Broker</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                {broker.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {broker.description || "No description provided."}
              </p>
              <div className="mt-4 rounded-2xl bg-slate-100/80 px-4 py-3 text-sm dark:bg-slate-800/80">
                {activityCounts[broker.id] || 0} linked activities
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBroker(broker);
                    setModalOpen(true);
                  }}
                  className="text-sm font-medium text-primary"
                >
                  Edit
                </button>
                <a href={`/brokers/${broker.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Open
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(broker.id)}
                  className="text-sm font-medium text-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="surface-card p-6 text-sm text-slate-500 dark:text-slate-400">
            No brokers added yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBroker(null);
        }}
        title={editingBroker ? "Edit broker" : "Add broker"}
      >
        <AddBrokerForm
          initialValues={editingBroker || undefined}
          onSubmit={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingBroker(null);
          }}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
