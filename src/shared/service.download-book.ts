import z from "zod";
import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";

export const DownloadBookPathParameters = z.object({
  book: BookId,
});
export type DownloadBookPathParameters = z.infer<
  typeof DownloadBookPathParameters
>;

export const DownloadBookResponse = z.object({
  success: z.boolean(),
});
export type DownloadBookResponse = z.infer<typeof DownloadBookResponse>;

export class DownloadBookService extends AbstractService<
  NoBodyParams,
  DownloadBookPathParameters,
  DownloadBookResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:book/download.docx";

  override async fetch(
    params: DownloadBookPathParameters | NoBodyParams,
  ): Promise<DownloadBookResponse> {
    const response = await fetch(`/api/book/${params.book}/download.docx`);
    if (!response.ok) {
      throw new Error("Failed to generate DOCX");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${params.book}.docx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    return { success: true };
  }
}

export const downloadBookService = new DownloadBookService(
  NoBodyParams,
  DownloadBookPathParameters,
  DownloadBookResponse,
);
