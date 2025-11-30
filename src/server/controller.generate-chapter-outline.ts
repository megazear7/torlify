import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import { AbstractController } from "./main.controller.js";
import {
  GenerateChapterOutlinePathParameters,
  generateChapterOutlineService,
} from "../shared/service.generate-chapter-outline.js";
import { generateChapterOutline } from "./util.generate-chapter-outline.js";
import { getBook } from "./util.book.js";
import { Chapter } from "../shared/type.book.js";

export class GenerateChapterOutlineController extends AbstractController<
  NoBodyParams,
  GenerateChapterOutlinePathParameters,
  Chapter
> {
  async handler({
    pathParams,
  }: RequestOptions<
    NoBodyParams,
    GenerateChapterOutlinePathParameters
  >): Promise<Chapter> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new Error("Book not found");
    }
    const chapter = book.chapters.find(
      (c) => c.number === parseInt(pathParams.chapter),
    );
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    return await generateChapterOutline(book, chapter);
  }
}

export const generateChapterOutlineController =
  new GenerateChapterOutlineController(generateChapterOutlineService);
