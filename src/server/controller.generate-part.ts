import { ChatCompletionMessageParam } from "openai/resources.js";
import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  GeneratePartPathParameters,
  generatePartService,
} from "../shared/service.generate-part.js";
import {
  Book,
  BookChapterPartText,
  Chapter,
  ChapterPart,
  ChapterPartDescription,
  ChapterPartNumber,
  ReferenceUse,
} from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { makeChapterPartPrompt } from "./prompt.make-chapter-part.js";
import { getBook, saveBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { submitPrompt } from "./util.submit-prompt.js";
import { referencesPrompt } from "./prompt.references.js";
import { writtenChaptersPrompt } from "./prompt.written-chapters.js";
import { editInstructionsPrompt } from "./prompt.edit-instructions.js";
import { priorPartsPrompt } from "./prompt.prior-parts.js";
import { promises as fs } from "fs";
import { fixPlotPrompt } from "./prompt.fix-plot.js";
import { fixQualityPrompt } from "./prompt.fix-quality.js";

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

    await fs.rm(`debug/generate-part`, { recursive: true, force: true });
    await fs.mkdir(`debug/generate-part`, { recursive: true });
    const authoredPart = await authorPart(
      book,
      chapter,
      partNumber,
      partDescription,
    );
    await fs.writeFile(`debug/generate-part/authored-part.txt`, authoredPart);
    const fixedPlotPart = await fixPlot(
      book,
      chapter,
      partNumber,
      partDescription,
      authoredPart,
    );
    await fs.writeFile(
      `debug/generate-part/fixed-plot-part.txt`,
      fixedPlotPart,
    );
    const fixedQualityPart = await fixQuality(
      book,
      chapter,
      partNumber,
      partDescription,
      fixedPlotPart,
    );
    await fs.writeFile(
      `debug/generate-part/fixed-quality-part.txt`,
      fixedQualityPart,
    );

    chapter.parts[partNumber - 1] = {
      number: parseInt(pathParams.part),
      text: fixedQualityPart,
    };
    await saveBook(book);
    return chapter.parts[partNumber - 1];
  }
}

async function authorPart(
  book: Book,
  chapter: Chapter,
  partNumber: ChapterPartNumber,
  partDescription: ChapterPartDescription,
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    ...(await referencesPrompt(book, ReferenceUse.enum.writing)),
    ...(await editInstructionsPrompt(book)),
    ...(await writtenChaptersPrompt(book, chapter)),
    ...(await priorPartsPrompt(chapter, partNumber)),
    ...(await makeChapterPartPrompt(chapter, partNumber, partDescription)),
  ];
  return await submitPrompt<string>(messages);
}

async function fixPlot(
  book: Book,
  chapter: Chapter,
  partNumber: ChapterPartNumber,
  partDescription: ChapterPartDescription,
  partText: BookChapterPartText,
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    ...(await referencesPrompt(book, ReferenceUse.enum.plot)),
    ...(await fixPlotPrompt(chapter, partNumber, partDescription, partText)),
  ];
  return await submitPrompt<string>(messages);
}

async function fixQuality(
  book: Book,
  chapter: Chapter,
  partNumber: ChapterPartNumber,
  partDescription: ChapterPartDescription,
  partText: BookChapterPartText,
): Promise<string> {
  const history: ChatCompletionMessageParam[] = [
    ...(await editInstructionsPrompt(book)),
    ...(await fixQualityPrompt(chapter, partNumber, partDescription, partText)),
  ];
  return await submitPrompt<string>(history);
}

export const generatePartController = new GeneratePartController(
  generatePartService,
);
