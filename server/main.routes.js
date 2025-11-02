import { clientController } from "./controller.client.js";
import { healthController } from "./controller.health.js";
export const routes = (server) => {
    server.get("/health", healthController);
    server.get("*", clientController);
};
//# sourceMappingURL=main.routes.js.map