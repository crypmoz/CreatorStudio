import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { IS_PRODUCTION } from "./config/env";
import { setupSecurity } from "./middleware/security";

const app = express();

// Trust proxies (needed for rate limiting behind proxies)
app.set('trust proxy', 1);

// Apply enhanced security middleware
setupSecurity(app);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
