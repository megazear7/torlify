import { Router } from "express";
import { getChapterTitleAudioService } from "../shared/service.get-chapter-title-audio.js";
import { createReadStream, promises as fs } from "fs";

export async function registerGetChapterTitleAudio(router: Router): Promise<void> {
  router.get(getChapterTitleAudioService.path, async (req, res) => {
    const audioPath = `data/books/${req.params.book}/audio/chapter_${req.params.chapter}_title.mp3`;

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
