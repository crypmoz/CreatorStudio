import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { IS_PRODUCTION } from "./config/env";
import { injectStorage } from "./middleware/auth.middleware";

const app = express();

// Apply security middleware for production
if (IS_PRODUCTION) {
  // Enable Helmet security headers
  app.use(helmet());
  
  // Configure CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
} else {
  // Looser CORS policy for development
  app.use(cors());
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Apply rate limiting to API routes
app.use("/api", apiLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inject storage into request
app.use(injectStorage);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Custom error handling middleware - more detailed and structured
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Log errors in production, full stack in development
    if (IS_PRODUCTION) {
      console.error(`[ERROR] ${req.method} ${req.path}: ${err.message}`);
    } else {
      console.error(err);
    }

    // Determine status code
    const status = err.status || err.statusCode || 500;
    
    // Define the error response type
    interface ErrorResponse {
      status: number;
      message: string;
      errors?: any;
      code?: string;
      stack?: string;
    }

    // Create response object
    const errorResponse: ErrorResponse = {
      status: status,
      message: err.message || "Internal Server Error",
    };
    
    // Add optional properties if they exist
    if (err.errors) errorResponse.errors = err.errors;
    if (err.code) errorResponse.code = err.code;
    
    // Only include stack trace in development
    if (!IS_PRODUCTION && err.stack) {
      errorResponse.stack = err.stack;
    }

    // Send error response
    res.status(status).json(errorResponse);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
