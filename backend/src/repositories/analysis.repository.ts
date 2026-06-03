import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import type { AnalysisResult } from "../types/analysis";

export const analysisRepository = {
  create(data: {
    userId: string;
    resumeFileName: string;
    jobDescription: string;
    score: number;
    analysisJson: AnalysisResult;
  }) {
    return prisma.analysis.create({
      data: {
        userId: data.userId,
        resumeFileName: data.resumeFileName,
        jobDescription: data.jobDescription,
        score: data.score,
        analysisJson: data.analysisJson as unknown as Prisma.InputJsonValue,
      },
    });
  },

  findByUserId(userId: string) {
    return prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        resumeFileName: true,
        jobDescription: true,
        score: true,
        analysisJson: true,
        createdAt: true,
      },
    });
  },
};
