"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/request";

const DEFAULT_SETTINGS = {
  default_currency: "AUD",
  theme: "light",
  exchange_rates: {},
  notification_preferences: {},
};

export function useUserSettings() {
  const { user, getIdToken } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setSettings(DEFAULT_SETTINGS);
      return;
    }

    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await fetchJson("/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      setError(null);
    } catch (fetchError) {
      console.error("Settings fetch error:", fetchError.message || fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (payload) => {
    const token = await getIdToken();
    const data = await fetchJson("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setSettings((current) => ({ ...current, ...data }));
    return data;
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    saveSettings,
  };
}

export default useUserSettings;
