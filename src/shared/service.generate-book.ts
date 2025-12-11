import { AbstractService, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book } from "./type.book.js";
import z from "zod";

export const MINIMUM_PART_LENGTH = 100;
export const MAXIMUM_PART_LENGTH = 2000;

export const MINIMUM_NUMBER_OF_CHAPTERS = 1;
export const MAXIMUM_NUMBER_OF_CHAPTERS = 50;

export const GenerateBookParameters = z.object({
  instructions: z.string(),
  numberOfChapters: z.number().min(MINIMUM_NUMBER_OF_CHAPTERS).max(MAXIMUM_NUMBER_OF_CHAPTERS),
  partLength: z.number().min(MINIMUM_PART_LENGTH).max(MAXIMUM_PART_LENGTH),
});
export type GenerateBookParameters = z.infer<typeof GenerateBookParameters>;

export class GenerateBookService extends AbstractService<GenerateBookParameters, NoPathParams, Book> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/generate";
}

export const generateBookService = new GenerateBookService(GenerateBookParameters, NoPathParams, Book);
