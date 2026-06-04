"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader, HistoryList } from "@/components/dashboard/history-list";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardHeader />
        <HistoryList />
      </AppShell>
    </ProtectedRoute>
  );
}
