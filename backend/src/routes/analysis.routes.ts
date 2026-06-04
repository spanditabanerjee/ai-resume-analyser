import { Router } from "express";
import { analysisController } from "../controllers/analysis.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { analyzeSchema } from "../validators/analysis.schema";

const router = Router();

router.post(
  "/analyze",
  authMiddleware,
  validateBody(analyzeSchema),
  analysisController.analyze
);

export default router;
