import { z } from "zod";
import { AppError } from "../middleware/error.middleware";
import type { AnalysisResult } from "../types/analysis";

const nonEmptyString = z.string().trim().min(1);

const stringArraySchema = z
  .array(z.union([z.string(), z.number()]).transform(String))
  .transform((items) => items.map((item) => item.trim()).filter(Boolean));

export const analysisResultSchema = z
  .object({
    score: z.coerce.number().int().min(0).max(100),
    strengths: stringArraySchema.pipe(z.array(nonEmptyString).min(1)),
    weaknesses: stringArraySchema.pipe(z.array(nonEmptyString).min(1)),
    missingSkills: stringArraySchema.pipe(z.array(nonEmptyString)),
    atsSuggestions: stringArraySchema.pipe(z.array(nonEmptyString).min(1)),
  })
  .strict();

export function extractJsonPayload(raw: string): string {
  const trimmed = raw.trim();

  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const objectStart = trimmed.indexOf("{");
  const objectEnd = trimmed.lastIndexOf("}");
  if (objectStart !== -1 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }

  return trimmed;
}

export function parseJson(raw: string): unknown {
  const payload = extractJsonPayload(raw);

  try {
    return JSON.parse(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown parse error";
    throw new AppError(
      502,
      "OPENAI_INVALID_JSON",
      `OpenAI returned malformed JSON: ${message}`
    );
  }
}

export function validateAnalysisResult(data: unknown): AnalysisResult {
  const result = analysisResultSchema.safeParse(data);

  if (!result.success) {
    console.error("OpenAI response validation failed:", result.error.flatten());
    throw new AppError(
      502,
      "OPENAI_INVALID_RESPONSE",
      "OpenAI returned JSON that does not match the required analysis schema"
    );
  }

  return result.data;
}

export function parseAndValidateAnalysisJson(raw: string): AnalysisResult {
  if (!raw.trim()) {
    throw new AppError(502, "OPENAI_EMPTY_RESPONSE", "OpenAI returned an empty response");
  }

  const parsed = parseJson(raw);
  return validateAnalysisResult(parsed);
}
