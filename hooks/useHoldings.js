"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/request";

export function useHoldings() {
  const { user, getIdToken } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldings = useCallback(async () => {
    if (!user) {
      setHoldings([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await fetchJson("/api/holdings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHoldings(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching holdings:", err.message || err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return { holdings, loading, error, fetchHoldings };
}

export default useHoldings;
