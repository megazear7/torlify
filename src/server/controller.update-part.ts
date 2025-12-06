import { RequestOptions } from "../shared/main.service.js";
import {
  UpdatePartBodyParameters,
  UpdatePartPathParameters,
  updatePartService,
} from "../shared/service.update-part.js";
import { ChapterPart } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook, saveBook } from "./util.book.js";
import { RouteError } from "./util.route.js";

export class UpdatePartController extends AbstractController<
  UpdatePartBodyParameters,
  UpdatePartPathParameters,
  ChapterPart
> {
  async handler({
    bodyParams,
    pathParams,
  }: RequestOptions<UpdatePartBodyParameters, UpdatePartPathParameters>): Promise<ChapterPart> {
    const book = await getBook(pathParams.book);
    const chapter = book.chapters.find((chapter) => chapter.number === parseInt(pathParams.chapter));
    if (!chapter) {
      throw new RouteError(404, "Chapter not found");
    }
    const part = chapter.parts.find((part) => part.number === bodyParams.part.number);
    if (!part) {
      throw new RouteError(404, "Part not found");
    }
    chapter.parts = chapter.parts.map((part) => (part.number === bodyParams.part.number ? bodyParams.part : part));
    await saveBook(book);
    return part;
  }
}

export const updatePartController = new UpdatePartController(updatePartService);
