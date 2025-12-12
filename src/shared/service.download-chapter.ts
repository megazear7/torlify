import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";

export const DownloadChapterPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type DownloadChapterPathParameters = z.infer<typeof DownloadChapterPathParameters>;

export const DownloadChapterResponse = z.object({
  success: z.boolean(),
});
export type DownloadChapterResponse = z.infer<typeof DownloadChapterResponse>;

export class DownloadChapterService extends AbstractService<
  NoBodyParams,
  DownloadChapterPathParameters,
  DownloadChapterResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/chapter/:chapter/download.docx";

  override async fetch(params: DownloadChapterPathParameters | NoBodyParams): Promise<DownloadChapterResponse> {
    const response = await fetch(`/api/book/${params.book}/chapter/${params.chapter}/download.docx`);
    if (!response.ok) {
      throw new Error("Failed to download DOCX");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${params.book}-chapter-${params.chapter}.docx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    return { success: true };
  }
}

export const downloadChapterService = new DownloadChapterService(
  NoBodyParams,
  DownloadChapterPathParameters,
  DownloadChapterResponse,
);
