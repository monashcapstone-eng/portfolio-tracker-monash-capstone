"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/request";

export function useActivities() {
  const { user, getIdToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await fetchJson("/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching activities:", err.message || err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (activityData) => {
    const token = await getIdToken();
    const newActivity = await fetchJson("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });
    setActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  };

  const deleteActivity = async (id) => {
    const token = await getIdToken();
    await fetchJson(`/api/activities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return { activities, loading, error, fetchActivities, addActivity, deleteActivity };
}

export default useActivities;
