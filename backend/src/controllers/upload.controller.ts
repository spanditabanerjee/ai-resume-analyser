import { Request, Response, NextFunction } from "express";
import { extractTextFromPdf } from "../utils/pdf-parser";
import { AppError } from "../middleware/error.middleware";

export const uploadController = {
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError(400, "FILE_REQUIRED", "PDF file is required");
      }

      const extractedText = await extractTextFromPdf(req.file.buffer);

      res.status(200).json({
        success: true,
        data: {
          fileName: req.file.originalname,
          extractedText,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "EMPTY_PDF") {
          next(new AppError(422, "EMPTY_PDF", "No readable text found in the PDF"));
          return;
        }
      }
      next(err);
    }
  },
};
