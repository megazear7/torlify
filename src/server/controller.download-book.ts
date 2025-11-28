import { Router } from "express";
import { downloadBookService } from "../shared/service.download-book.js";
import { createDocxFile } from "./util.book-file-docx.js";

export async function registerDownloadBook(router: Router): Promise<void> {
  router.get(downloadBookService.path, async (req, res) => {
    try {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${req.params.book}.docx"`,
      );
      res.send(await createDocxFile(req.params.book));
    } catch (error) {
      console.error("Error generating DOCX:", error);
      res.status(500).send("Error generating DOCX file");
    }
  });
}
