import { openaiService } from "./openai.service";
import { analysisRepository } from "../repositories/analysis.repository";
import type { AnalyzeInput } from "../validators/analysis.schema";

export const analysisService = {
  async analyze(userId: string, input: AnalyzeInput) {
    const result = await openaiService.analyzeResume(input.resumeText, input.jobDescription);

    const analysis = await analysisRepository.create({
      userId,
      resumeFileName: input.resumeFileName ?? "resume.txt",
      jobDescription: input.jobDescription,
      score: result.score,
      analysisJson: result,
    });

    return {
      id: analysis.id,
      ...result,
      createdAt: analysis.createdAt,
    };
  },
};
