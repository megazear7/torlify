import { AbstractService, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book } from "./type.book.js";
import z from "zod";

export const GenerateBookParameters = z.object({
  instructions: z.string(),
});
export type GenerateBookParameters = z.infer<typeof GenerateBookParameters>;

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
