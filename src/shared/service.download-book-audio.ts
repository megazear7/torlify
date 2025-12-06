import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";

export const DownloadBookAudioPathParameters = z.object({
  book: BookId,
});
export type DownloadBookAudioPathParameters = z.infer<typeof DownloadBookAudioPathParameters>;

export const DownloadBookAudioResponse = z.object({
  success: z.boolean(),
});
export type DownloadBookAudioResponse = z.infer<typeof DownloadBookAudioResponse>;

export class DownloadBookAudioService extends AbstractService<
  NoBodyParams,
  DownloadBookAudioPathParameters,
  DownloadBookAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/download.mp3";

  override async fetch(params: DownloadBookAudioPathParameters | NoBodyParams): Promise<DownloadBookAudioResponse> {
    const response = await fetch(`/api/book/${params.book}/download.mp3`);
    if (!response.ok) {
      throw new Error("Failed to download MP3");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${params.book}.mp3`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    return { success: true };
  }
}

export const downloadBookAudioService = new DownloadBookAudioService(
  NoBodyParams,
  DownloadBookAudioPathParameters,
  DownloadBookAudioResponse,
);
