import { Book } from "../shared/type.book.js";
import { getPartAudioPath } from "./util.get-part-audio-path.js";
import { concatMp3Files } from "./util.audio.js";

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

  return concatMp3Files(audioPaths);
}
