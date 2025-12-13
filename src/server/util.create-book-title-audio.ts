import { Book, BookId } from "../shared/type.book.js";
import { getBook, saveBook } from "./util.book.js";
import { promises as fs } from "fs";
import { loadAudioClient } from "./util.model.js";

export async function createBookTitleAudio(bookId: BookId): Promise<Book> {
  const book: Book = await getBook(bookId);
  const client = await loadAudioClient(book.model);

  const response = await client.chat.completions.create({
    model: book.model.audio.modelName,
    modalities: ["text", "audio"],
    max_completion_tokens: 15000,
    audio: {
      voice: book.model.audio.voice!,
      format: "mp3",
    },
    messages: [
      {
        role: "system",
        content: `You are a professional audiobook narrator introducing a book.\n\n${book.instructions.audio}\n\nSpeak the provided title clearly and only speak the title, nothing else.`,
      },
      {
        role: "user",
        content: `Speak this title: "${book.title}"`,
      },
    ],
  });

  const audio = response.choices[0].message.audio?.data;
  if (!audio) {
    throw new Error("No audio data returned in the response");
  }

  const buffer = Buffer.from(audio, "base64");
  await fs.mkdir(`data/books/${book.id}/audio`, { recursive: true });
  await fs.writeFile(`data/books/${book.id}/audio/book_intro.mp3`, buffer);

  await saveBook(book);
  return book;
}
