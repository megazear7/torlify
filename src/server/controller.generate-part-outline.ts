import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import { AbstractController } from "./main.controller.js";
import {
  GeneratePartOutlinePathParameters,
  generatePartOutlineService,
} from "../shared/service.generate-part-outline.js";
import { generatePartOutline } from "./util.generate-part-outline.js";
import { getBook } from "./util.book.js";
import { Chapter } from "../shared/type.book.js";
import { RouteError } from "./util.route.js";

export class GeneratePartOutlineController extends AbstractController<
  NoBodyParams,
  GeneratePartOutlinePathParameters,
  Chapter
> {
  async handler({ pathParams }: RequestOptions<NoBodyParams, GeneratePartOutlinePathParameters>): Promise<Chapter> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new RouteError(404, "Book not found");
    }
    const chapter = book.chapters.find((c) => c.number === parseInt(pathParams.chapter));
    if (!chapter) {
      throw new RouteError(404, "Chapter not found");
    }
    const part = chapter.parts.find((p) => p.number === parseInt(pathParams.part));
    if (!part) {
      throw new RouteError(404, "Part not found");
    }
    return await generatePartOutline(book, chapter, part);
  }
}

export const generatePartOutlineController = new GeneratePartOutlineController(generatePartOutlineService);
