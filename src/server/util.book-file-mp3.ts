import { Book } from "../shared/type.book.js";
import { getPartAudioPath } from "./util.get-part-audio-path.js";
import { createReadStream, promises as fs } from "fs";

export async function createMp3File(book: Book): Promise<Buffer> {
  let gapFound = false;
  const audioPaths = [];
  for (const chapter of book.chapters) {
    for (const part of chapter.parts) {
      if (part.audio && !gapFound) {
        audioPaths.push(await getPartAudioPath(book.id, chapter.number, part.number));
      } else {
        gapFound = true;
      }
    }
  }

  // TODO: Concatenate audio files from audioPaths into a single MP3 buffer

  await fs.stat(audioPaths[0]);
  const stream = createReadStream(audioPaths[0]);
  return stream.read();
}
