import express from "express";
import { listBooksController } from "./controller.list-books.js";
import { healthController } from "./controller.health.js";
import { getBookController } from "./controller.get-book.js";
import { generateBookController } from "./controller.generate-book.js";
import { clientController } from "./controller.client.js";
import { updateBookController } from "./controller.update-book.js";
import { registerUploadReference } from "./controller.upload-reference.js";
import { updateChapterController } from "./controller.update-chapter.js";
import { updatePartController } from "./controller.update-part.js";
import { generatePartController } from "./controller.generate-part.js";
import { registerDownloadBook } from "./controller.download-book.js";
import { generateChapterOutlineController } from "./controller.generate-chapter-outline.js";
import { deleteBookController } from "./controller.delete-book.js";

const router = express.Router();

healthController.register(router);
listBooksController.register(router);
getBookController.register(router);
generateBookController.register(router);
clientController.register(router);
updateBookController.register(router);
updateChapterController.register(router);
updatePartController.register(router);
generatePartController.register(router);
generateChapterOutlineController.register(router);
deleteBookController.register(router);
registerUploadReference(router);
registerDownloadBook(router);

export { router };
