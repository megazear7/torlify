import express, { NextFunction, Request, Response } from "express";
import "./main.errors.js";
import { router } from "./main.router.js";
import { RouteError } from "./util.route.js";

const port = 3000;
const server = express();

server.use(express.json({ limit: "10mb" }));
server.use(express.static("dist/client"));
server.use(express.static("dist/shared"));
server.use(express.static("src/static"));

server.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api")) console.log(`${req.method} ${req.path}`);
  next();
});

server.use(router);

server.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof RouteError) {
    console.error(`Route error ${err.statusCode}:`, err.message);
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
});

server.listen(port, () => console.log(`Example app listening on port ${port}`));
