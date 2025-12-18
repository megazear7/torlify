import { AbstractService, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book, BookRequestStub } from "./type.book.js";
import z from "zod";

export const CreateBookParameters = BookRequestStub;
export type CreateBookParameters = z.infer<typeof CreateBookParameters>;

export class CreateBookService extends AbstractService<CreateBookParameters, NoPathParams, Book> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/create";
}

export const createBookService = new CreateBookService(CreateBookParameters, NoPathParams, Book);
