"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/auth/AdminRoute";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/request";

export default function AdminPage() {
  const { getIdToken, user } = useAuth();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    default_currency: "AUD",
    free_limit: 3,
    premium_limit: 999,
    default_theme: "light",
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        const token = await getIdToken();
        const headers = { Authorization: `Bearer ${token}` };
        const [usersData, settingsData] = await Promise.all([
          fetchJson("/api/admin/users", { headers }),
          fetchJson("/api/admin/system-settings", { headers }),
        ]);
        setUsers(usersData);
        setSystemSettings(settingsData);
      } catch (error) {
        console.error("Admin load error:", error);
        setStatus("Unable to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [getIdToken, user]);

  const updateUser = async (targetUid, payload) => {
    const token = await getIdToken();
    await fetchJson("/api/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid: targetUid, ...payload }),
    });
    setUsers((current) =>
      current.map((entry) => (entry.uid === targetUid ? { ...entry, ...payload } : entry))
    );
  };

  const deleteUser = async (targetUid) => {
    if (!window.confirm("Delete this user and all related data?")) {
      return;
    }

    const token = await getIdToken();
    await fetchJson("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUid }),
    });
    setUsers((current) => current.filter((entry) => entry.uid !== targetUid));
  };

  const saveSystemSettings = async (event) => {
    event.preventDefault();
    const token = await getIdToken();
    await fetchJson("/api/admin/system-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(systemSettings),
    });
    setStatus("System settings saved.");
  };

  return (
    <AdminRoute>
      <div className="space-y-6">
        <section className="surface-card p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
            User management and system defaults
          </h1>
        </section>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${tab === "users" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
          >
            User Management
          </button>
          <button
            type="button"
            onClick={() => setTab("system")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${tab === "system" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
          >
            System Config
          </button>
        </div>

        {tab === "users" ? (
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-700/70">
                <thead className="bg-slate-50/80 dark:bg-slate-900/60">
                  <tr className="text-left text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Admin</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : (
                    users.map((entry) => (
                      <tr key={entry.uid}>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {entry.first_name} {entry.last_name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{entry.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.plan || "free"}
                            onChange={(event) => updateUser(entry.uid, { plan: event.target.value })}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                          >
                            <option value="free">free</option>
                            <option value="premium">premium</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={Boolean(entry.is_admin)}
                            onChange={(event) => updateUser(entry.uid, { is_admin: event.target.checked })}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => deleteUser(entry.uid)}
                            className="text-sm font-medium text-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "system" ? (
          <form className="surface-card p-6 md:p-8" onSubmit={saveSystemSettings}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={systemSettings.default_currency || ""}
                onChange={(event) =>
                  setSystemSettings((current) => ({ ...current, default_currency: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Default currency"
              />
              <input
                value={systemSettings.default_theme || ""}
                onChange={(event) =>
                  setSystemSettings((current) => ({ ...current, default_theme: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Default theme"
              />
              <input
                type="number"
                value={systemSettings.free_limit || 0}
                onChange={(event) =>
                  setSystemSettings((current) => ({ ...current, free_limit: Number(event.target.value) }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Free plan limit"
              />
              <input
                type="number"
                value={systemSettings.premium_limit || 0}
                onChange={(event) =>
                  setSystemSettings((current) => ({ ...current, premium_limit: Number(event.target.value) }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Premium plan limit"
              />
            </div>
            <button
              type="submit"
              className="mt-6 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Save system config
            </button>
          </form>
        ) : null}

        {status ? <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p> : null}
      </div>
    </AdminRoute>
  );
}
