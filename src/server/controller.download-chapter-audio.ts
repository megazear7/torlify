import { Router } from "express";
import { downloadChapterAudioService } from "../shared/service.download-chapter-audio.js";
import { getBook } from "./util.book.js";
import { getChapterAudio } from "./util.audio.js";

export async function registerDownloadChapterAudio(router: Router): Promise<void> {
  router.get(downloadChapterAudioService.path, async (req, res) => {
    const book = await getBook(req.params.book);
    const chapter = book.chapters[parseInt(req.params.chapter) - 1];
    try {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.book}.mp3"`);
      const stream = await getChapterAudio(book, chapter);
      stream.pipe(res);
    } catch (error) {
      console.error("Error generating audio file:", error);
      res.status(500).send("Error creating audio file");
    }
  });
}
