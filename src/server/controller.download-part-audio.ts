import { Router } from "express";
import { downloadPartAudioService } from "../shared/service.download-part-audio.js";
import { getPartAudioPath } from "./util.get-part-audio-path.js";
import { createReadStream } from "fs";

export async function registerDownloadPartAudio(router: Router): Promise<void> {
  router.get(downloadPartAudioService.path, async (req, res) => {
    const audioPath = await getPartAudioPath(req.params.book, parseInt(req.params.chapter), parseInt(req.params.part));
    try {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${req.params.book}-chapter-${req.params.chapter}-part-${req.params.part}.mp3"`,
      );
      const stream = createReadStream(audioPath);
      stream.pipe(res);
    } catch (error) {
      console.error("Error generating audio file:", error);
      res.status(500).send("Error creating audio file");
    }
  });
}
