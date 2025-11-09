import express from "express";
import "./main.errors.js";
import { router } from "./main.router.js";
import { loggingMiddleware } from "./main.logging.js";
import { errorHandler } from "./main.errors.js";

const port = 3000;
const server = express();

server.use(express.json({ limit: "10mb" }));
server.use(express.static("dist/client"));
server.use(express.static("dist/shared"));
server.use(express.static("src/static"));
server.use(loggingMiddleware);
server.use(router);
server.use(errorHandler);

server.listen(port, () => console.log(`Example app listening on port ${port}`));
