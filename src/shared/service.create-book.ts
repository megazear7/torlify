import { AbstractService, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book } from "./type.book.js";
import z from "zod";

export const MINIMUM_NUMBER_OF_CHAPTERS = 1;
export const MAXIMUM_NUMBER_OF_CHAPTERS = 30;

export const CreateBookParameters = z.object({
  instructions: z.string(),
  numberOfChapters: z.number().min(MINIMUM_NUMBER_OF_CHAPTERS).max(MAXIMUM_NUMBER_OF_CHAPTERS),
});
export type CreateBookParameters = z.infer<typeof CreateBookParameters>;

export class CreateBookService extends AbstractService<CreateBookParameters, NoPathParams, Book> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/create";
}

export const createBookService = new CreateBookService(CreateBookParameters, NoPathParams, Book);
