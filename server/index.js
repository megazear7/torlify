import express from "express";
import "./main.errors.js";
import { routes } from "./main.routes.js";
const port = 3000;
const server = express();
server.use(express.json({ limit: "10mb" }));
routes(server);
server.use((err, _req, res) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
});
server.listen(port, () => console.log(`Example app listening on port ${port}`));
//# sourceMappingURL=index.js.map