import express from "express";
import { HealthController } from "./controller.health.js";
import {
  BookController,
  BooksController,
  GenerateEmptyBookController,
} from "./controller.book.js";
import { ClientController } from "./controller.client.js";

const router = express.Router();

new HealthController().register(router);
new BooksController().register(router);
new BookController().register(router);
new GenerateEmptyBookController().register(router);
new ClientController().register(router);

export { router };
