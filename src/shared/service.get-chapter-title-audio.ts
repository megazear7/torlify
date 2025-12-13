import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";

export const GetChapterTitleAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type GetChapterTitleAudioPathParameters = z.infer<typeof GetChapterTitleAudioPathParameters>;

export const GetChapterTitleAudioResponse = z.object({
  success: z.boolean(),
});
export type GetChapterTitleAudioResponse = z.infer<typeof GetChapterTitleAudioResponse>;

export class GetChapterTitleAudioService extends AbstractService<
  NoBodyParams,
  GetChapterTitleAudioPathParameters,
  GetChapterTitleAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/chapter/:chapter/title/audio";

  override async fetch(
    params: GetChapterTitleAudioPathParameters | NoBodyParams,
  ): Promise<GetChapterTitleAudioResponse> {
    console.log("GetChapterTitleAudioService.fetch called", params);
    throw new Error("Not implemented on client. This endpoint is meant to be used with audio streaming.");
  }
}

export const getChapterTitleAudioService = new GetChapterTitleAudioService(
  NoBodyParams,
  GetChapterTitleAudioPathParameters,
  GetChapterTitleAudioResponse,
);
