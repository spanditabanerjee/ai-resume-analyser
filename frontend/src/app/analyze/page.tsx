"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { AnalyzeForm } from "@/components/analyze/analyze-form";

export default function AnalyzePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mb-6">
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">Analyze Resume</h1>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base">
            Upload your resume and paste a job description to get AI-powered feedback
          </p>
        </div>
        <AnalyzeForm />
      </AppShell>
    </ProtectedRoute>
  );
}
