"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <Header onMenuToggle={() => setSidebarOpen(true)} />
            <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
