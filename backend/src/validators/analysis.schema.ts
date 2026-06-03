import { z } from "zod";

export const analyzeSchema = z.object({
  resumeText: z.string().min(50, "Resume text must be at least 50 characters"),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters"),
  resumeFileName: z.string().min(1).max(255).optional(),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
