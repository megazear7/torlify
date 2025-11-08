import { Request, Response } from "express";
import { healthService } from "./service.health.js";

export const healthController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.json(healthService());
};
