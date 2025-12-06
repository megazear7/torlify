import { RequestOptions } from "../shared/main.service.js";
import {
  UpdateChapterBodyParameters,
  UpdateChapterPathParameters,
  updateChapterService,
} from "../shared/service.update-chapter.js";
import { Chapter, ChapterPartial } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook, saveBook } from "./util.book.js";

export class UpdateChapterController extends AbstractController<
  UpdateChapterBodyParameters,
  UpdateChapterPathParameters,
  ChapterPartial
> {
  async handler({
    bodyParams,
    pathParams,
  }: RequestOptions<UpdateChapterBodyParameters, UpdateChapterPathParameters>): Promise<Chapter> {
    const existingBook = await getBook(pathParams.book);
    const updatedBook = {
      ...existingBook,
      chapters: existingBook.chapters.map((chapter) =>
        chapter.number === bodyParams.chapter.number ? { ...chapter, ...bodyParams.chapter } : chapter,
      ),
    };
    await saveBook(updatedBook);
    const chapter = updatedBook.chapters.find((chapter) => chapter.number === bodyParams.chapter.number);

    if (!chapter) {
      throw new Error("Chapter not found after update");
    }

    return chapter;
  }
}

export const updateChapterController = new UpdateChapterController(updateChapterService);
