import { Request, Response, NextFunction } from "express";
import { analysisService } from "../services/analysis.service";

export const analysisController = {
  async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await analysisService.analyze(req.user!.id, req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
