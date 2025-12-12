import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";
import { downloadBlobFile } from "../client/util.download.js";

export const DownloadChapterAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type DownloadChapterAudioPathParameters = z.infer<typeof DownloadChapterAudioPathParameters>;

export const DownloadChapterAudioResponse = z.object({
  success: z.boolean(),
});
export type DownloadChapterAudioResponse = z.infer<typeof DownloadChapterAudioResponse>;

export class DownloadChapterAudioService extends AbstractService<
  NoBodyParams,
  DownloadChapterAudioPathParameters,
  DownloadChapterAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/chapter/:chapter/download.mp3";

  override async fetch(
    params: DownloadChapterAudioPathParameters | NoBodyParams,
  ): Promise<DownloadChapterAudioResponse> {
    const response = await fetch(`/api/book/${params.book}/chapter/${params.chapter}/download.mp3`);
    if (!response.ok) {
      throw new Error("Failed to download MP3");
    }
    const blob = await response.blob();
    downloadBlobFile(blob, `${params.book}-chapter-${params.chapter}.mp3`);
    return { success: true };
  }
}

export const downloadChapterAudioService = new DownloadChapterAudioService(
  NoBodyParams,
  DownloadChapterAudioPathParameters,
  DownloadChapterAudioResponse,
);
