import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, Chapter } from "./type.book.js";
import z from "zod";

export const DeleteChapterTitleAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type DeleteChapterTitleAudioPathParameters = z.infer<typeof DeleteChapterTitleAudioPathParameters>;

export class DeleteChapterTitleAudioService extends AbstractService<
  NoBodyParams,
  DeleteChapterTitleAudioPathParameters,
  Chapter
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.delete;
  readonly path = "/api/book/:book/chapter/:chapter/title/audio";
}

export const deleteChapterTitleAudioService = new DeleteChapterTitleAudioService(
  NoBodyParams,
  DeleteChapterTitleAudioPathParameters,
  Chapter,
);
