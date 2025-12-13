import { NoPathParams, RequestOptions } from "../shared/main.service.js";
import { CreateBookParameters, createBookService } from "../shared/service.create-book.js";
import { Book } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { readAppConfig } from "./service.app-config.js";
import { saveBook } from "./util.book.js";
import { submitPrompt } from "./util.submit-prompt.js";
import { promises as fs } from "fs";

export class CreateBookController extends AbstractController<CreateBookParameters, NoPathParams, Book> {
  async handler({ bodyParams }: RequestOptions<CreateBookParameters, NoPathParams>): Promise<Book> {
    const appConfig = await readAppConfig();
    const title: string = await submitPrompt([
      {
        role: "user",
        content: `Give a book title for the following description\nOnly respond with the title and absolutely no other text: ${bodyParams.instructions}`,
      },
    ]);
    const name: string = title
      .trim()
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    const book: Book = {
      updatedAt: Date.now(),
      createdAt: Date.now(),
      id: name,
      title: title,
      overview: bodyParams.instructions, // Yes this mismatches, but it's intentional
      chapters: [],
      references: [],
      instructions: { writing: "", edit: "", audio: "" },
      pronunciation: [],
      characters: [],
      model: {
        text: {
          usage: { prompt_tokens: 0, completion_tokens: 0 },
          name: "",
          endpoint: "",
          modelName: "",
          cost: {
            inputTokenCost: 0,
            inputTokenCount: 0,
            outputTokenCost: 0,
            outputTokenCount: 0,
          },
        },
        audio: {
          usage: { prompt_tokens: 0, completion_tokens: 0 },
          name: "",
          endpoint: "",
          modelName: "",
          voice: appConfig.model.audio.voice,
          cost: {
            inputTokenCost: 0,
            inputTokenCount: 0,
            outputTokenCost: 0,
            outputTokenCount: 0,
          },
        },
      },
      loadingMessages: [],
    };
    book.model.text = appConfig.model.text;
    book.model.audio = appConfig.model.audio;
    for (let i = 1; i <= bodyParams.numberOfChapters; i++) {
      book.chapters.push({
        number: i,
        title: `Chapter ${i}`,
        parts: [
          { number: 1, text: "" },
          { number: 2, text: "" },
        ],
        outline: ["", ""],
        maxParts: 2,
        minParts: 4,
        when: "",
        where: "",
        what: "",
        why: "",
        how: "",
        who: "",
        partLength: bodyParams.partLength,
      });
    }
    await fs.mkdir(`data/books/${book.id}`, { recursive: true });
    await saveBook(book);
    return book;
  }
}

export const createBookController = new CreateBookController(createBookService);
