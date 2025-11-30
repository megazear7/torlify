import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  GeneratePartAudioPathParameters,
  generatePartAudioService,
} from "../shared/service.generate-part-audio.js";
import { Chapter, ChapterPart } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { createChapterPartAudio } from "./util.create-chapter-part-audio.js";
import { RouteError } from "./util.route.js";

export class GeneratePartAudioController extends AbstractController<
  NoBodyParams,
  GeneratePartAudioPathParameters,
  ChapterPart
> {
  async handler({
    pathParams,
  }: RequestOptions<
    NoBodyParams,
    GeneratePartAudioPathParameters
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

    return await createChapterPartAudio(book.id, chapter.number, partNumber);
  }
}

export const generatePartAudioController = new GeneratePartAudioController(
  generatePartAudioService,
);
