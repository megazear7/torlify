import { health } from "./service.health.js";
export const healthController = async (_req, res) => {
    res.json(health());
};
//# sourceMappingURL=controller.health.js.map