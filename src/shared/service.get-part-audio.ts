import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";

export const GetChapterAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
  part: z.string(),
});
export type GetChapterAudioPathParameters = z.infer<typeof GetChapterAudioPathParameters>;

export const GetChapterAudioResponse = z.object({
  success: z.boolean(),
});
export type GetChapterAudioResponse = z.infer<typeof GetChapterAudioResponse>;

export class GetChapterAudioService extends AbstractService<
  NoBodyParams,
  GetChapterAudioPathParameters,
  GetChapterAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/chapter/:chapter/part/:part/audio";

  override async fetch(params: GetChapterAudioPathParameters | NoBodyParams): Promise<GetChapterAudioResponse> {
    console.log("GetChapterAudioService.fetch called", params);
    throw new Error("Not implemented on client. This endpoint is meant to be used with audio streaming.");
  }
}

export const getChapterAudioService = new GetChapterAudioService(
  NoBodyParams,
  GetChapterAudioPathParameters,
  GetChapterAudioResponse,
);
