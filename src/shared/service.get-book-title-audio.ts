import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";

export const GetBookTitleAudioPathParameters = z.object({
  book: BookId,
});
export type GetBookTitleAudioPathParameters = z.infer<typeof GetBookTitleAudioPathParameters>;

export const GetBookTitleAudioResponse = z.object({
  success: z.boolean(),
});
export type GetBookTitleAudioResponse = z.infer<typeof GetBookTitleAudioResponse>;

export class GetBookTitleAudioService extends AbstractService<
  NoBodyParams,
  GetBookTitleAudioPathParameters,
  GetBookTitleAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/title/audio";

  override async fetch(params: GetBookTitleAudioPathParameters | NoBodyParams): Promise<GetBookTitleAudioResponse> {
    console.log("GetBookTitleAudioService.fetch called", params);
    throw new Error("Not implemented on client. This endpoint is meant to be used with audio streaming.");
  }
}

export const getBookTitleAudioService = new GetBookTitleAudioService(
  NoBodyParams,
  GetBookTitleAudioPathParameters,
  GetBookTitleAudioResponse,
);
