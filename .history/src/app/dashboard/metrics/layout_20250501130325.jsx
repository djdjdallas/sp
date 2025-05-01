// src/app/dashboard/metrics/layout.jsx
"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function MetricsLayout({ children }) {
  return (
    <div>
      <DashboardHeader />
      {children}
    </div>
  );
}
