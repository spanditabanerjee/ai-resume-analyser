import { Router } from "express";
import authRoutes from "./auth.routes";
import { API_PREFIX } from "../config/constants";

const router = Router();

router.use("/auth", authRoutes);

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

export { router, API_PREFIX };
