import { Router } from "express";
import { downloadBookAudioService } from "../shared/service.download-book-audio.js";
import { getBook } from "./util.book.js";
import { getBookAudio } from "./util.audio.js";

export async function registerDownloadBookAudio(router: Router): Promise<void> {
  router.get(downloadBookAudioService.path, async (req, res) => {
    const book = await getBook(req.params.book);
    try {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.book}.mp3"`);
      const stream = await getBookAudio(book);
      stream.pipe(res);
    } catch (error) {
      console.error("Error generating audio file:", error);
      res.status(500).send("Error creating audio file");
    }
  });
}
