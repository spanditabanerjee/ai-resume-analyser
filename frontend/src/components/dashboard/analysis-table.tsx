"use client";

import { Badge } from "@/components/ui/badge";
import type { AnalysisRecord } from "@/types";

interface Props {
  analyses: AnalysisRecord[];
}

const getStatus = (score: number | null) => {
  if (!score) return "Pending";
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  return "Needs Work";
};

export function AnalysisTable({ analyses }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="p-4 text-left">Resume</th>
            <th className="p-4 text-left">Score</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {analyses.map((analysis) => (
            <tr
              key={analysis.id}
              className="border-b hover:bg-muted/30"
            >
              <td className="p-4 font-medium">
                {analysis.resumeFileName}
              </td>

              <td className="p-4">
                {analysis.score ?? "--"}%
              </td>

              <td className="p-4">
                <Badge>
                  {getStatus(analysis.score)}
                </Badge>
              </td>

              <td className="p-4 text-muted-foreground">
                {new Date(
                  analysis.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}