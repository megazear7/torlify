import { AbstractService, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { GenerateBookParameters } from "./type.request.generate-book.js";
import { Book } from "./type.book.js";

export class GenerateBookService extends AbstractService<
  GenerateBookParameters,
  NoPathParams,
  Book
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/generate";
}

export const generateBookService = new GenerateBookService(GenerateBookParameters, NoPathParams, Book);
