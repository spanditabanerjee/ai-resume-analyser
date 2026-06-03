import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";
import { AppError } from "../middleware/error.middleware";

const router = Router();

function handleUpload(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  uploadResume(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        next(new AppError(413, "FILE_TOO_LARGE", "PDF must be 5 MB or smaller"));
        return;
      }
      next(new AppError(400, "UPLOAD_ERROR", err.message));
      return;
    }

    if (err instanceof Error && err.message === "INVALID_FILE_TYPE") {
      next(new AppError(415, "INVALID_FILE_TYPE", "Only PDF files are allowed"));
      return;
    }

    if (err) {
      next(err);
      return;
    }

    next();
  });
}

router.post("/upload", authMiddleware, handleUpload, uploadController.upload);

export default router;
