"use client";

import { FileText, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AnalysisRecord } from "@/types";

interface Props {
  analyses: AnalysisRecord[];
}

export function DashboardStats({ analyses }: Props) {
  const totalAnalyses = analyses.length;

  const scores = analyses
    .map((a) => a.score)
    .filter((s): s is number => s !== null);

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((acc, curr) => acc + curr, 0) / scores.length
        )
      : 0;

  const bestScore =
    scores.length > 0 ? Math.max(...scores) : 0;

  const stats = [
    {
      title: "Total Analyses",
      value: totalAnalyses,
      icon: FileText,
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: TrendingUp,
    },
    {
      title: "Best Score",
      value: `${bestScore}%`,
      icon: Trophy,
    },
    {
      title: "AI Status",
      value: "Ready",
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {stat.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stat.value}
              </h2>
            </div>

            <stat.icon className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}