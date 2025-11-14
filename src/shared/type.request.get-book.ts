import z from "zod";
import { BookId } from "./type.book";

export const GetBookPathParameters = z.object({
  bookId: BookId,
});
export type GetBookPathParameters = z.infer<typeof GetBookPathParameters>;
