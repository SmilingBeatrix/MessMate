import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { allowedOrigins, isProduction, env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// --- HARDCODED PRODUCTION URL TO BYPASS ENV ISSUES ---
const PRODUCTION_URL = "https://messmate-r38e.onrender.com";

// CORS options - applied per-route in app.js so static assets aren't affected
export const corsOptions = {
  origin: isProduction
    ? (origin, callback) => {
        if (!origin) return callback(null, true);
        
        // Allow if it's the hardcoded URL OR in the allowedOrigins list
        if (origin === PRODUCTION_URL || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new ApiError(403, "Origin not allowed by CORS"));
      }
    : (origin, callback) => {
        return callback(null, true);
      },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposedHeaders: ["Content-Disposition"],
  maxAge: 86400
};

export function applySecurity(app) {
  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
}

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: "Too many authentication attempts. Please try again later." }
});

// CSRF guard for state-changing requests (POST/PUT/PATCH/DELETE)
export function originCheck(req, res, next) {
  if (!isProduction) return next();

  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return next();

  const origin = req.get("origin");
  const referer = req.get("referer");
  let checkOrigin = origin;
  if (!checkOrigin && referer) {
    try { checkOrigin = new URL(referer).origin; } catch { checkOrigin = null; }
  }

  if (!checkOrigin) {
    return next(new ApiError(403, "Missing origin for state-changing request"));
  }

  // Explicitly allow the Render URL
  if (checkOrigin === PRODUCTION_URL || allowedOrigins.includes(checkOrigin)) {
    return next();
  }

  // Allow same-origin requests (page calling its own API)
  const host = req.get("host");
  const protocol = req.get("x-forwarded-proto") || req.protocol || "http";
  const selfOrigin = `${protocol}://${host}`;
  if (checkOrigin === selfOrigin) return next();

  return next(new ApiError(403, "Request origin is not allowed"));
}

export const cookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  domain: env.COOKIE_DOMAIN || undefined,
  path: "/"
};
