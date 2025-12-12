import { Router } from "express";
import { downloadChapterService } from "../shared/service.download-chapter.js";
import { createChapterDocxFile } from "./util.book-file-docx.js";

export async function registerDownloadChapter(router: Router): Promise<void> {
  router.get(downloadChapterService.path, async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.book}.docx"`);
      res.send(await createChapterDocxFile(req.params.book, parseInt(req.params.chapter)));
    } catch (error) {
      console.error("Error generating DOCX:", error);
      res.status(500).send("Error generating DOCX file");
    }
  });
}
