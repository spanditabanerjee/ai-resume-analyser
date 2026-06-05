import OpenAI from "openai";
import { env } from "../config/env";
import type { AnalysisResult } from "../types/analysis";
import { AppError } from "../middleware/error.middleware";
import { parseAndValidateAnalysisJson } from "../utils/parse-ai-json";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const MAX_VALIDATION_RETRIES = 2;

const SYSTEM_PROMPT = `You are an expert resume analyst and ATS (Applicant Tracking System) specialist.
Analyze the candidate's resume against the provided job description.

You MUST respond with a single valid JSON object and nothing else.
Do not include markdown, code fences, comments, or explanatory text.

Required JSON shape:
{
  "score": <integer from 0 to 100>,
  "strengths": [<non-empty strings>],
  "weaknesses": [<non-empty strings>],
  "missingSkills": [<strings, may be empty array>],
  "atsSuggestions": [<non-empty strings>]
}

Be specific, concise, and grounded in the resume and job description.`;

const RETRY_PROMPT =
  "Your previous response was not valid JSON matching the required schema. " +
  "Return ONLY a corrected JSON object with keys: score, strengths, weaknesses, missingSkills, atsSuggestions.";

async function requestAnalysis(
  resumeText: string,
  jobDescription: string,
  retry: boolean
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `## Resume\n${resumeText}\n\n## Job Description\n${jobDescription}`,
      },
      ...(retry ? [{ role: "user" as const, content: RETRY_PROMPT }] : []),
    ],
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new AppError(502, "OPENAI_EMPTY_RESPONSE", "OpenAI returned an empty response");
  }

  return content;
}

export const openaiService = {
  async analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
    let lastError: AppError | null = null;

    for (let attempt = 0; attempt <= MAX_VALIDATION_RETRIES; attempt++) {
      try {
         const content = await requestAnalysis(resumeText, jobDescription, attempt > 0);
         return parseAndValidateAnalysisJson(content);
        // return {
        //   score: 82,
        //   strengths: [
        //     "Node.js",
        //     "TypeScript",
        //     "PostgreSQL"
        //   ],
        //   weaknesses: [
        //     "AWS experience not highlighted"
        //   ],
        //   missingSkills: [
        //     "Docker",
        //     "Kubernetes"
        //   ],
        //   atsSuggestions: [
        //     "Add quantified achievements",
        //     "Highlight backend scalability projects",
        //     "Include more keywords from the job description"
        //   ]
        // };
    
      } catch (err) {
        if (
          err instanceof AppError &&
          (err.code === "OPENAI_INVALID_JSON" || err.code === "OPENAI_INVALID_RESPONSE")
        ) {
          lastError = err;
          if (attempt < MAX_VALIDATION_RETRIES) {
            console.warn(`OpenAI JSON validation failed, retrying (${attempt + 1}/${MAX_VALIDATION_RETRIES})`);
            continue;
          }
        }

        if (err instanceof AppError) throw err;

        console.error("OpenAI analysis failed:", err);
        throw new AppError(502, "OPENAI_ERROR", "Failed to analyze resume with OpenAI");
      }
    }

    throw lastError ?? new AppError(502, "OPENAI_ERROR", "Failed to analyze resume with OpenAI");
  },
};
