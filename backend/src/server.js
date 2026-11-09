import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import app from "./app.js";
import { initSocket } from "./sockets/index.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, "../..");
const clientBuildDir = path.join(workspaceRoot, "frontend", "dist");

// Serve compiled React SPA bundle
app.use(express.static(clientBuildDir));

// Client-side routing fallback for non-API requests
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientBuildDir, "index.html"));
});

// Terminal Error Interceptors
app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);
let isTerminating = false;

async function bootstrapMatrixServer() {
  await connectDB();

  // Verify and patch legacy leave/rebate records on boot
  try {
    const { migrateRequestTypes } = await import("./services/leaveService.js");
    const patchSummary = await migrateRequestTypes();
    if (patchSummary.fixed > 0) {
      console.log(
        `[MessMatrix::Migration] Patched requestType on ${patchSummary.fixed} leave documents`,
      );
    } else {
      console.log("[MessMatrix::Migration] Leave schema integrity verified");
    }
  } catch (migrationErr) {
    console.error(
      "[MessMatrix::Migration] Schema check warning:",
      migrationErr.message,
    );
  }

  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log("==========================================================");
    console.log(` ⚡ MESSMATRIX CORE ENGINE ONLINE`);
    console.log(` 🌐 API & Socket Endpoint : http://localhost:${env.PORT}`);
    console.log(` 📦 Static SPA Directory  : ${clientBuildDir}`);
    console.log("==========================================================");
  });
}

async function gracefulShutdown(signalOrigin) {
  if (isTerminating) return;
  isTerminating = true;
  console.log(
    `\n[MessMatrix::Lifecycle] Signal (${signalOrigin}) received. Closing active connections...`,
  );

  const killTimer = setTimeout(() => {
    console.error(
      "[MessMatrix::Lifecycle] Timeout exceeded. Forcing process exit.",
    );
    process.exit(1);
  }, 10000);
  killTimer.unref();

  httpServer.close(async () => {
    try {
      await disconnectDB();
      clearTimeout(killTimer);
      console.log(
        "[MessMatrix::Lifecycle] Database disconnected. Shutdown complete.",
      );
      process.exit(0);
    } catch (dbErr) {
      console.error(
        "[MessMatrix::Lifecycle] Error disconnecting database:",
        dbErr,
      );
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("[MessMatrix::Runtime] Unhandled Promise Rejection:", reason);
  gracefulShutdown("unhandledRejection");
});
process.on("uncaughtException", (err) => {
  console.error("[MessMatrix::Runtime] Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});

bootstrapMatrixServer().catch((bootErr) => {
  console.error("[MessMatrix::Fatal] Failed to initialize server:", bootErr);
  process.exit(1);
});
