import {
  Book,
  BookId,
  Chapter,
  ChapterNumber,
  ChapterPartNumber,
  ChapterPart,
} from "../shared/type.book.js";
import { getBook, saveBook } from "./util.book.js";
import crypto from "crypto";
import { promises as fs } from "fs";
import { loadAudioClient } from "./util.model.js";

export async function createChapterPartAudio(
  bookId: BookId,
  chapterNumber: ChapterNumber,
  chapterPartNumber: ChapterPartNumber,
): Promise<ChapterPart> {
  const book: Book = await getBook(bookId);
  const chapter: Chapter = book.chapters[chapterNumber - 1];
  const client = await loadAudioClient(book.model);

  // Apply pronunciations to the text
  let processedText = chapter.parts[chapterPartNumber - 1].text;
  if (book.pronunciation && book.pronunciation.length > 0) {
    for (const pronunciation of book.pronunciation) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${pronunciation.match}\\b`, "gi");
      processedText = processedText.replace(regex, pronunciation.replace);
    }
  }

  const response = await client.chat.completions.create({
    model: book.model.audio.modelName,
    modalities: ["text", "audio"],
    max_completion_tokens: 15000,
    audio: {
      voice: book.model.audio.voice!, // Preview voice options here: https://www.openai.fm/
      format: "mp3",
    },
    messages: [
      {
        role: "system",
        content: `You are a professional audio book narrator. You repeat the provided text exactly as written. ${book.instructions.audio}`,
      },
      {
        role: "user",
        content: processedText,
      },
      {
        role: "user",
        content: "Please speak the above text exactly as written",
      },
    ],
  });
  const audio = response.choices[0].message.audio?.data;
  if (!audio) {
    throw new Error("No audio data returned in the response");
  }
  const buffer = Buffer.from(audio, "base64");
  const id = crypto.randomUUID();
  await fs.mkdir(`data/books/${book.id}/audio`, { recursive: true });
  await fs.writeFile(`data/books/${book.id}/audio/${id}.mp3`, buffer);
  chapter.parts[chapterPartNumber - 1].audio = id;
  await saveBook(book);
  return chapter.parts[chapterPartNumber - 1];
}
