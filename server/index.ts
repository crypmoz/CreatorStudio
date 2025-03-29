import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { IS_PRODUCTION } from "./config/env";
import { securityMiddleware, validateContentType, sanitizeInput } from "./middleware/security";
import { requestLogger } from "./middleware/request-logger";
import { logger } from "./utils/logger";

const app = express();

// Trust proxies (needed for rate limiting behind proxies)
app.set('trust proxy', 1);

// Apply enhanced security middleware - securityMiddleware is an array of middleware functions
securityMiddleware.forEach(middleware => app.use(middleware));
app.use(validateContentType);
app.use(sanitizeInput);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logger middleware
app.use(requestLogger);

(async () => {
  const server = await registerRoutes(app);

  // Custom error handling middleware - more detailed and structured
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Log errors with structured logger
    const errorMetadata = {
      method: req.method,
      path: req.path,
      statusCode: err.status || err.statusCode || 500,
      errorName: err.name,
      errorCode: err.code
    };
    
    if (IS_PRODUCTION) {
      // In production, log the error message and metadata but not the stack trace
      logger.error(`${req.method} ${req.path}: ${err.message}`, errorMetadata);
    } else {
      // In development, include stack trace in logs
      logger.error(`${req.method} ${req.path}: ${err.message}`, {
        ...errorMetadata,
        stack: err.stack
      });
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
    logger.info(`CreatorAIDE API server running on port ${port}`, {
      environment: process.env.NODE_ENV || 'development',
      port: port
    });
  });
})();
