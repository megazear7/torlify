import express, { Request, Response } from "express";
import "./main.errors.js";
import { router } from "./main.router.js";

const port = 3000;
const server = express();

server.use(express.json({ limit: "10mb" }));
server.use(express.static("dist/client"));
server.use(express.static("dist/shared"));
server.use(express.static("src/static"));
server.use(router);

server.use((err: Error, _req: Request, res: Response) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

server.listen(port, () => console.log(`Example app listening on port ${port}`));
