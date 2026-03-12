"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AdminRoute({ children }) {
  const router = useRouter();
  const { loading, profile } = useAuth();

  useEffect(() => {
    if (!loading && !profile?.is_admin) {
      router.replace("/home");
    }
  }, [loading, profile, router]);

  if (loading || !profile?.is_admin) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
}
