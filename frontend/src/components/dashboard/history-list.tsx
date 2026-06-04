"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Plus } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { AnalysisRecord } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function scoreBadgeVariant(score: number | null) {
  if (score === null) return "secondary" as const;
  if (score >= 80) return "default" as const;
  if (score >= 60) return "secondary" as const;
  return "destructive" as const;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function HistoryList() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listAnalyses()
      .then(setAnalyses)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load history")
      )
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading history...</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive text-sm">{error}</p>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <FileText className="size-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No analyses yet</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Upload a resume and run your first analysis.
            </p>
          </div>
          <Link href="/analyze" className={buttonVariants()}>
            <Plus className="size-4" />
            New analysis
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {analyses.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 text-base">{item.resumeFileName}</CardTitle>
              <Badge variant={scoreBadgeVariant(item.score)}>
                {item.score ?? "—"}
              </Badge>
            </div>
            <CardDescription>{formatDate(item.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <p className="line-clamp-3 flex-1 text-muted-foreground text-sm">
              {item.jobDescription}
            </p>
            {item.analysisJson && (
              <p className="text-xs">
                <span className="text-muted-foreground">Top strength: </span>
                {item.analysisJson.strengths[0]}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground text-sm sm:text-base">
          Your resume analysis history
        </p>
      </div>
      <Link href="/analyze" className={buttonVariants()}>
        New analysis
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
