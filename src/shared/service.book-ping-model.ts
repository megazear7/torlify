import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import z from "zod";

export const BookPingModelPathParams = z.object({
  book: z.string(),
});
export type BookPingModelPathParams = z.infer<typeof BookPingModelPathParams>;

export const BookPingModelResponse = z.string();
export type BookPingModelResponse = z.infer<typeof BookPingModelResponse>;

export class BookPingModelService extends AbstractService<
  NoBodyParams,
  BookPingModelPathParams,
  BookPingModelResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/model/ping";
}

export const bookPingModelService = new BookPingModelService(
  NoBodyParams,
  BookPingModelPathParams,
  BookPingModelResponse,
);
