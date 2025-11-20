import express from "express";
import { listBooksController } from "./controller.list-books.js";
import { healthController } from "./controller.health.js";
import { getBookController } from "./controller.get-book.js";
import { generateBookController } from "./controller.generate-book.js";
import { clientController } from "./controller.client.js";
import { updateBookController } from "./controller.update-book.js";

const router = express.Router();

healthController.register(router);
listBooksController.register(router);
getBookController.register(router);
generateBookController.register(router);
clientController.register(router);
updateBookController.register(router);

export { router };
