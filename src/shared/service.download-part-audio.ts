import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";
import { downloadBlobFile } from "../client/util.download.js";

export const DownloadPartAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
  part: z.string(),
});
export type DownloadPartAudioPathParameters = z.infer<typeof DownloadPartAudioPathParameters>;

export const DownloadPartAudioResponse = z.object({
  success: z.boolean(),
});
export type DownloadPartAudioResponse = z.infer<typeof DownloadPartAudioResponse>;

export class DownloadPartAudioService extends AbstractService<
  NoBodyParams,
  DownloadPartAudioPathParameters,
  DownloadPartAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/chapter/:chapter/part/:part/download.mp3";

  override async fetch(params: DownloadPartAudioPathParameters | NoBodyParams): Promise<DownloadPartAudioResponse> {
    const response = await fetch(`/api/book/${params.book}/chapter/${params.chapter}/part/${params.part}/download.mp3`);
    if (!response.ok) {
      throw new Error("Failed to download MP3");
    }
    const blob = await response.blob();
    downloadBlobFile(blob, `${params.book}-chapter-${params.chapter}-part-${params.part}.mp3`);
    return { success: true };
  }
}

export const downloadPartAudioService = new DownloadPartAudioService(
  NoBodyParams,
  DownloadPartAudioPathParameters,
  DownloadPartAudioResponse,
);
