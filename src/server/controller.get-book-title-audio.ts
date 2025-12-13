import { Router } from "express";
import { getBookTitleAudioService } from "../shared/service.get-book-title-audio.js";
import { createReadStream, promises as fs } from "fs";

export async function registerGetBookTitleAudio(router: Router): Promise<void> {
  router.get(getBookTitleAudioService.path, async (req, res) => {
    const audioPath = `data/books/${req.params.book}/audio/book_intro.mp3`;

    try {
      await fs.stat(audioPath);
      res.setHeader("Content-Type", "audio/mpeg");
      const stream = createReadStream(audioPath);
      stream.pipe(res);
    } catch {
      res.status(404).send("Audio file not found");
    }
  });
}
