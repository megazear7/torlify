import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  DeleteChapterTitleAudioPathParameters,
  deleteChapterTitleAudioService,
} from "../shared/service.delete-chapter-title-audio.js";
import { Chapter } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { promises as fs } from "fs";

export class DeleteChapterTitleAudioController extends AbstractController<
  NoBodyParams,
  DeleteChapterTitleAudioPathParameters,
  Chapter
> {
  async handler({ pathParams }: RequestOptions<NoBodyParams, DeleteChapterTitleAudioPathParameters>): Promise<Chapter> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new RouteError(404, "Book not found");
    }
    const chapterNumber = parseInt(pathParams.chapter);
    const chapter = book.chapters.find((ch: Chapter) => ch.number === chapterNumber);
    if (!chapter) {
      throw new RouteError(404, "Chapter not found");
    }
    const audioPath = `data/books/${pathParams.book}/audio/chapter_${chapterNumber}_title.mp3`;
    try {
      await fs.unlink(audioPath);
    } catch (error) {
      // Ignore if file doesn't exist
      console.log("Audio file not found or already deleted:", error);
    }
    return chapter;
  }
}

export const deleteChapterTitleAudioController = new DeleteChapterTitleAudioController(deleteChapterTitleAudioService);
