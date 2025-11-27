import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  GeneratePartPathParameters,
  generatePartService,
} from "../shared/service.generate-part.js";
import { Chapter, ChapterPart } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { makeChapterPartPrompt } from "./prompt.make-chapter-part.js";
import { getBook, saveBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { submitPrompt } from "./util.submit-prompt.js";

export class GeneratePartController extends AbstractController<
  NoBodyParams,
  GeneratePartPathParameters,
  ChapterPart
> {
  async handler({
    pathParams,
  }: RequestOptions<
    NoBodyParams,
    GeneratePartPathParameters
  >): Promise<ChapterPart> {
    const book = await getBook(pathParams.book);
    const partNumber = parseInt(pathParams.part);
    const chapter = book.chapters.find(
      (ch: Chapter) => ch.number === parseInt(pathParams.chapter),
    );
    if (!chapter) {
      throw new RouteError(404, "Chapter not found");
    }
    const partDescription = chapter.outline[partNumber - 1];
    if (!partDescription) {
      throw new RouteError(404, "Part description not found");
    }
    const messages = await makeChapterPartPrompt(
      chapter,
      partNumber,
      partDescription,
    );
    const partText = await submitPrompt<string>(messages);
    chapter.parts[partNumber - 1] = {
      number: parseInt(pathParams.part),
      text: partText,
    };
    await saveBook(book);
    return chapter.parts[partNumber - 1];
  }
}

export const generatePartController = new GeneratePartController(
  generatePartService,
);
