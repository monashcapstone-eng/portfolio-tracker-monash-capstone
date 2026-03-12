"use client";
import { useMemo } from "react";
import { calculatePortfolioMetrics } from "@/lib/portfolio";

export function usePortfolio(activities = []) {
  const portfolio = useMemo(
    () => calculatePortfolioMetrics(activities),
    [activities]
  );

  return portfolio;
}

export default usePortfolio;
