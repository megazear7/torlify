import { createContext } from "@lit/context";
import {
  Book,
  BookMinimalInfo,
  Chapter,
  ChapterPart,
} from "../shared/type.book.js";
import z from "zod";
import { LoadingStatus } from "../shared/type.loading.js";

export const BooksContext = z.object({
  books: BookMinimalInfo.array().optional(),
  status: LoadingStatus,
  error: z.string().optional(),
});
export type BooksContext = z.infer<typeof BooksContext>;
export const booksContext = createContext<BooksContext>("books");

export const BookContext = z.object({
  book: Book.optional(),
  status: LoadingStatus,
  error: z.string().optional(),
});
export type BookContext = z.infer<typeof BookContext>;
export const bookContext = createContext<BookContext>("book");

export const ChapterContext = z.object({
  chapter: Chapter.optional(),
  status: LoadingStatus,
  error: z.string().optional(),
});
export type ChapterContext = z.infer<typeof ChapterContext>;
export const chapterContext = createContext<ChapterContext>("chapter");

export const PartContext = z.object({
  part: ChapterPart.optional(),
  status: LoadingStatus,
  error: z.string().optional(),
});
export type PartContext = z.infer<typeof PartContext>;
export const partContext = createContext<PartContext>("part");
