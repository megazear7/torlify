import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  GenerateChapterTitleAudioPathParameters,
  generateChapterTitleAudioService,
} from "../shared/service.generate-chapter-title-audio.js";
import { Chapter } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { createChapterTitleAudio } from "./util.create-chapter-title-audio.js";

export class GenerateChapterTitleAudioController extends AbstractController<
  NoBodyParams,
  GenerateChapterTitleAudioPathParameters,
  Chapter
> {
  async handler({
    pathParams,
  }: RequestOptions<NoBodyParams, GenerateChapterTitleAudioPathParameters>): Promise<Chapter> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new RouteError(404, "Book not found");
    }
    const chapterNumber = parseInt(pathParams.chapter);
    const chapter = book.chapters.find((ch: Chapter) => ch.number === chapterNumber);
    if (!chapter) {
      throw new RouteError(404, "Chapter not found");
    }
    if (!chapter.title || chapter.title.trim() === "") {
      throw new RouteError(400, "Chapter title is required to generate audio");
    }
    return await createChapterTitleAudio(book.id, chapterNumber);
  }
}

export const generateChapterTitleAudioController = new GenerateChapterTitleAudioController(
  generateChapterTitleAudioService,
);
