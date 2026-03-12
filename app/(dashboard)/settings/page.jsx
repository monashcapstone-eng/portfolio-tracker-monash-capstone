"use client";

import { useEffect, useMemo, useState } from "react";
import { useActivities } from "@/hooks/useActivities";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useBrokers } from "@/hooks/useBrokers";
import { downloadTextFile } from "@/lib/request";
import ErrorBanner from "@/components/shared/ErrorBanner";

const TABS = ["General", "Accounts", "Appearance", "Data Export", "Profile"];

export default function SettingsPage() {
  const { profile, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activities, error: activitiesError } = useActivities();
  const { brokers, error: brokersError } = useBrokers();
  const { settings, saveSettings, loading, error: settingsError } = useUserSettings();
  const [tab, setTab] = useState("General");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const pageError = settingsError || brokersError || activitiesError;
  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
  });

  useEffect(() => {
    setProfileForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
    });
  }, [profile]);

  const exportCsv = useMemo(() => {
    const header = ["type", "date", "market", "code", "quantity", "price", "fees", "currency", "total_amount"];
    const rows = activities.map((activity) =>
      [
        activity.type,
        activity.date,
        activity.market,
        activity.code,
        activity.quantity,
        activity.price,
        activity.fees,
        activity.currency,
        activity.total_amount,
      ].join(",")
    );

    return [header.join(","), ...rows].join("\n");
  }, [activities]);

  const handleSaveGeneral = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setSaving(true);
      setStatus("");
      await saveSettings({
        default_currency: formData.get("default_currency"),
        theme,
        exchange_rates: {
          USD_AUD: formData.get("usd_aud") || "",
          GBP_AUD: formData.get("gbp_aud") || "",
        },
      });
      setStatus("General settings saved.");
    } catch (error) {
      console.error("Save general settings error:", error);
      setStatus("Unable to save general settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setStatus("");
      await updateProfile(profileForm);
      setStatus("Profile updated.");
    } catch (error) {
      console.error("Update profile error:", error);
      setStatus("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Settings
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Preferences, exports, and profile controls
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Configure user defaults, export data, manage appearance, and keep your profile information current.
        </p>
      </section>

      <ErrorBanner message={pageError} />

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === item
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "General" ? (
        <form className="surface-card p-6 md:p-8" onSubmit={handleSaveGeneral}>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              name="default_currency"
              defaultValue={settings.default_currency}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Default currency"
            />
            <input
              name="usd_aud"
              defaultValue={settings.exchange_rates?.USD_AUD || ""}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="USD/AUD rate"
            />
            <input
              name="gbp_aud"
              defaultValue={settings.exchange_rates?.GBP_AUD || ""}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="GBP/AUD rate"
            />
          </div>
          <button
            type="submit"
            disabled={loading || saving}
            className="mt-6 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Save general settings
          </button>
        </form>
      ) : null}

      {tab === "Accounts" ? (
        <section className="surface-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Broker accounts</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {brokers.length ? (
              brokers.map((broker) => (
                <div key={broker.id} className="rounded-2xl bg-slate-100/80 p-4 text-sm dark:bg-slate-800/80">
                  <p className="font-medium text-slate-950 dark:text-white">{broker.name}</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">{broker.description || "No description"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No broker accounts configured yet.</p>
            )}
          </div>
        </section>
      ) : null}

      {tab === "Appearance" ? (
        <section className="surface-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Appearance</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Toggle the saved dashboard theme and preview how cards render in the active mode.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </button>
            <div className="rounded-2xl border border-slate-200/80 px-4 py-3 text-sm dark:border-slate-700/70">
              Active mode: {theme}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "Data Export" ? (
        <section className="surface-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Data export</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Download your activity log as CSV or JSON.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadTextFile("activities.csv", exportCsv, "text/csv")}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() =>
                downloadTextFile("activities.json", JSON.stringify(activities, null, 2), "application/json")
              }
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Export JSON
            </button>
          </div>
        </section>
      ) : null}

      {tab === "Profile" ? (
        <form className="surface-card p-6 md:p-8" onSubmit={handleSaveProfile}>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              value={profileForm.first_name}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, first_name: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="First name"
            />
            <input
              value={profileForm.last_name}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, last_name: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Last name"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Save profile
          </button>
        </form>
      ) : null}

      {status ? <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p> : null}
    </div>
  );
}
