import { NextFunction, Request, Response } from "express";
import { RouteError } from "./util.route.js";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof RouteError) {
    console.error(` -> Route error ${err.statusCode}:`, err.message);
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err.stack);
  if (req.path.startsWith("/api")) {
    try {
      const jsonError = JSON.parse(err.message);
      res.status(500).json({ error: jsonError });
    } catch {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(500).send(`<html><body><h1>500 Internal Server Error</h1></body></html>`);
  }
};
