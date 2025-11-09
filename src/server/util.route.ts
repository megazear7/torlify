/**
 * Custom error class for route-related errors
 */
export class RouteError extends Error {
  /**
   * HTTP status code associated with the error
   */
  public readonly statusCode: number;

  /**
   * Creates a new RouteError instance
   * @param statusCode HTTP status code (e.g., 404, 500)
   * @param message Error message describing what went wrong
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'RouteError';
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RouteError);
    }
  }
}
