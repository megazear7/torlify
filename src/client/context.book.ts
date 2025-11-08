import {createContext} from '@lit/context';
import { Book } from '../shared/type.book.js';
import z from 'zod';
import { LoadingStatus } from '../shared/type.loading.js';

export const BookContext = z.object({
  book: Book.optional(),
  status: LoadingStatus,
  error: z.string().optional(),
});
export type BookContext = z.infer<typeof BookContext>;

export const bookContext = createContext<BookContext>('book');
