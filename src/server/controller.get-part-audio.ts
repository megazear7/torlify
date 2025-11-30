import { Router } from "express";
import { getChapterAudioService } from "../shared/service.get-part-audio.js";
import { createReadStream, promises as fs } from "fs";
import { getBook } from "./util.book.js";

export async function registerGetChapterAudio(router: Router): Promise<void> {
  router.get(getChapterAudioService.path, async (req, res) => {
    const book = await getBook(req.params.book);
    if (!book) {
      res.status(404).send("Book not found");
      return;
    }
    const audioId = book.chapters
      .find((ch) => ch.number === parseInt(req.params.chapter))
      ?.parts.find((p) => p.number === parseInt(req.params.part))?.audio;

    if (!audioId) {
      res.status(404).send("Audio file not found");
      return;
    }

    const audioPath = `data/books/${req.params.book}/audio/${audioId}.mp3`;

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
