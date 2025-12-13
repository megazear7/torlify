import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  GenerateBookTitleAudioPathParameters,
  generateBookTitleAudioService,
} from "../shared/service.generate-book-title-audio.js";
import { Book } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { createBookTitleAudio } from "./util.create-book-title-audio.js";

export class GenerateBookTitleAudioController extends AbstractController<
  NoBodyParams,
  GenerateBookTitleAudioPathParameters,
  Book
> {
  async handler({ pathParams }: RequestOptions<NoBodyParams, GenerateBookTitleAudioPathParameters>): Promise<Book> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new RouteError(404, "Book not found");
    }
    if (!book.title || book.title.trim() === "") {
      throw new RouteError(400, "Book title is required to generate audio");
    }
    return await createBookTitleAudio(book.id);
  }
}

export const generateBookTitleAudioController = new GenerateBookTitleAudioController(generateBookTitleAudioService);
