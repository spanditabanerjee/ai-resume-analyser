import { AlertCircle, CheckCircle2, Lightbulb, Target, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex size-24 items-center justify-center rounded-full border-4 bg-background font-bold text-3xl sm:size-28 sm:text-4xl",
          score >= 80 ? "border-emerald-500/30" : score >= 60 ? "border-amber-500/30" : "border-rose-500/30",
          color
        )}
      >
        {score}
      </div>
      <span className="text-muted-foreground text-xs uppercase tracking-wide">Match score</span>
    </div>
  );
}

function ListSection({
  title,
  icon: Icon,
  items,
  variant,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
  variant?: "default" | "warning" | "success";
}) {
  const iconColor =
    variant === "success"
      ? "text-emerald-600"
      : variant === "warning"
        ? "text-amber-600"
        : "text-primary";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={cn("size-4", iconColor)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>AI-powered resume match against the job description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-around">
          <ScoreRing score={result.score} />
          <div className="max-w-md space-y-3 text-center sm:text-left">
            <Badge variant="secondary" className="text-xs">
              {result.score >= 80 ? "Strong match" : result.score >= 60 ? "Moderate match" : "Needs improvement"}
            </Badge>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your resume scored {result.score}/100 for this role. Review strengths, gaps, and ATS tips below.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ListSection title="Strengths" icon={CheckCircle2} items={result.strengths} variant="success" />
        <ListSection title="Weaknesses" icon={AlertCircle} items={result.weaknesses} variant="warning" />
        <ListSection title="Missing Skills" icon={Target} items={result.missingSkills.length ? result.missingSkills : ["No major missing skills identified"]} />
        <ListSection title="ATS Suggestions" icon={Lightbulb} items={result.atsSuggestions} />
      </div>

      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-4">
          <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground text-sm">
            Tip: Tailor bullet points with keywords from the job description and quantify impact where possible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
