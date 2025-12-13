import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  DeleteBookTitleAudioPathParameters,
  deleteBookTitleAudioService,
} from "../shared/service.delete-book-title-audio.js";
import { Book } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { promises as fs } from "fs";

export class DeleteBookTitleAudioController extends AbstractController<
  NoBodyParams,
  DeleteBookTitleAudioPathParameters,
  Book
> {
  async handler({ pathParams }: RequestOptions<NoBodyParams, DeleteBookTitleAudioPathParameters>): Promise<Book> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new RouteError(404, "Book not found");
    }
    const audioPath = `data/books/${pathParams.book}/audio/book_intro.mp3`;
    try {
      await fs.unlink(audioPath);
    } catch (error) {
      // Ignore if file doesn't exist
      console.log("Audio file not found or already deleted:", error);
    }
    return book;
  }
}

export const deleteBookTitleAudioController = new DeleteBookTitleAudioController(deleteBookTitleAudioService);
