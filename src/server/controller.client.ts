import { Request, Response } from "express";
import { page } from "./service.client.js";

export const clientPath = "/{*any}";

export const clientController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.send(page());
};
