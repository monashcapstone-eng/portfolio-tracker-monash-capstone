"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/request";

export function useBrokers() {
  const { user, getIdToken } = useAuth();
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrokers = useCallback(async () => {
    if (!user) {
      setBrokers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await fetchJson("/api/brokers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrokers(data);
      setError(null);
    } catch (fetchError) {
      console.error("Brokers fetch error:", fetchError.message || fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, user]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const createBroker = async (payload) => {
    const token = await getIdToken();
    const broker = await fetchJson("/api/brokers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setBrokers((current) => {
      const exists = current.find((item) => item.id === broker.id);
      return exists ? current : [broker, ...current];
    });

    return broker;
  };

  const updateBroker = async (id, payload) => {
    const token = await getIdToken();
    const broker = await fetchJson(`/api/brokers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setBrokers((current) =>
      current.map((item) => (item.id === id ? { ...item, ...broker } : item))
    );

    return broker;
  };

  const deleteBroker = async (id) => {
    const token = await getIdToken();
    await fetchJson(`/api/brokers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBrokers((current) => current.filter((item) => item.id !== id));
  };

  return {
    brokers,
    loading,
    error,
    fetchBrokers,
    createBroker,
    updateBroker,
    deleteBroker,
  };
}

export default useBrokers;
