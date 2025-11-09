import express from "express";
import { router } from "./main.router.js";
import { loggingMiddleware } from "./main.logging.js";
import { errorHandler } from "./main.errors.js";
import { env } from "./main.env.js";
import "./main.errors.js";

const server = express();

server.use(express.json({ limit: "10mb" }));
server.use(express.static("dist/client"));
server.use(express.static("dist/shared"));
server.use(express.static("src/static"));
server.use(loggingMiddleware);
server.use(router);
server.use(errorHandler);

server.listen(env.APP_PORT, () =>
  console.log(`Example app listening on port ${env.APP_PORT}`),
);
