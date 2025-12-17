import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";
import z from "zod";

export const GenerateBookFieldBodyParameters = z.object({
  instructions: z.string(),
});
export type GenerateBookFieldBodyParameters = z.infer<typeof GenerateBookFieldBodyParameters>;

export const GenerateBookFieldPathParameters = z.object({
  property: z.string(),
  book: BookId,
});
export type GenerateBookFieldPathParameters = z.infer<typeof GenerateBookFieldPathParameters>;

export const GenerateBookFieldResponse = z.object({
  message: z.string(),
  value: z.string(),
});
export type GenerateBookFieldResponse = z.infer<typeof GenerateBookFieldResponse>;

export class GenerateBookFieldService extends AbstractService<
  GenerateBookFieldBodyParameters,
  GenerateBookFieldPathParameters,
  GenerateBookFieldResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/field/:property/generate";
}

export const generateBookFieldService = new GenerateBookFieldService(
  GenerateBookFieldBodyParameters,
  GenerateBookFieldPathParameters,
  GenerateBookFieldResponse,
);
