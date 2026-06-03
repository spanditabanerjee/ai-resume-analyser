import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";

const app = createApp();

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");

    app.listen(env.BACKEND_PORT, () => {
      console.log(`Server running on http://localhost:${env.BACKEND_PORT}`);
      console.log(`API available at http://localhost:${env.BACKEND_PORT}/api/v1`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
