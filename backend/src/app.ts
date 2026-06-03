import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { router, API_PREFIX } from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { env } from "./config/env";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use(API_PREFIX, router);
  app.use(errorMiddleware);

  return app;
}
