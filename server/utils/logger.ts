import { IS_PRODUCTION } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

/**
 * A simple structured logger for production and development environments
 */
class Logger {
  /**
   * Logs a debug message - only visible in development
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (!IS_PRODUCTION) {
      this.log('debug', message, metadata);
    }
  }

  /**
   * Logs an info message
   */
  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  /**
   * Logs a warning message
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  /**
   * Logs an error message
   */
  error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata);
  }

  /**
   * Internal log method with structured formatting
   */
  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    
    // Create the base log object
    const logObject = {
      timestamp,
      level,
      message,
      ...(metadata || {})
    };

    // Different output format based on environment
    if (IS_PRODUCTION) {
      // In production, output JSON for easy parsing by log aggregators
      console[level === 'debug' ? 'log' : level](JSON.stringify(logObject));
    } else {
      // In development, format for better human readability
      const colorCode = {
        debug: '\x1b[34m', // blue
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m'  // red
      }[level];
      
      const reset = '\x1b[0m';
      console[level === 'debug' ? 'log' : level](
        `${colorCode}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`,
        metadata ? metadata : ''
      );
    }
  }

  /**
   * Log HTTP requests in a standard format
   */
  httpRequest(req: any, res: any, responseTime: number): void {
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    
    this.info(`${method} ${originalUrl} ${statusCode} ${responseTime}ms`, {
      method,
      url: originalUrl,
      status: statusCode,
      responseTime,
      ip,
      userAgent: req.get('User-Agent')
    });
  }
}

// Export a singleton instance
export const logger = new Logger();