import { Router } from "express";
import { getChapterAudioService } from "../shared/service.get-part-audio.js";
import { createReadStream, promises as fs } from "fs";
import { getPartAudioPath } from "./util.get-part-audio-path.js";

export async function registerGetChapterAudio(router: Router): Promise<void> {
  router.get(getChapterAudioService.path, async (req, res) => {
    const audioPath = await getPartAudioPath(req.params.book, parseInt(req.params.chapter), parseInt(req.params.part));

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
