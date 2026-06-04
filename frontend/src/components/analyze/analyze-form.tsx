"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { AnalyzeResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadDropzone } from "@/components/analyze/upload-dropzone";
import { AnalysisResults } from "@/components/analyze/analysis-results";

export function AnalyzeForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleFileSelect(file: File) {
    setError("");
    setResult(null);
    setIsUploading(true);

    try {
      const data = await api.uploadResume(file);
      setFileName(data.fileName);
      setResumeText(data.extractedText);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to upload resume");
      setFileName(null);
      setResumeText("");
    } finally {
      setIsUploading(false);
    }
  }

  function handleClear() {
    setFileName(null);
    setResumeText("");
    setResult(null);
  }

  async function handleAnalyze() {
    setError("");
    setIsAnalyzing(true);

    try {
      const data = await api.analyze({
        resumeText,
        jobDescription,
        resumeFileName: fileName ?? undefined,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const canAnalyze = resumeText.length >= 50 && jobDescription.length >= 20 && !isAnalyzing;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Resume</CardTitle>
            <CardDescription>PDF only — text will be extracted automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropzone
              fileName={fileName}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
              disabled={isUploading || isAnalyzing}
            />
            {isUploading && (
              <p className="mt-3 flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="size-4 animate-spin" />
                Extracting text from PDF...
              </p>
            )}
            {resumeText && !isUploading && (
              <p className="mt-3 text-emerald-600 text-sm">
                ✓ {resumeText.length.toLocaleString()} characters extracted
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Job Description</CardTitle>
            <CardDescription>Paste the full job posting for targeted analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="job-description" className="sr-only">
              Job description
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              className="min-h-[200px] resize-y"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isAnalyzing}
            />
            <p className="text-muted-foreground text-xs">
              {jobDescription.length} characters (min. 20)
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-destructive text-sm">{error}</p>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={!canAnalyze || isUploading}
          className="min-w-[200px]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>

      {result && <AnalysisResults result={result} />}
    </div>
  );
}
