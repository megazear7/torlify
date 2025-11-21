import { Request, Router } from "express";
import multer from "multer";
import { promises as fs } from "fs";
import { uploadReferenceService } from "../shared/service.upload-reference.js";

const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    const book = req.params.book;
    const dir = `data/books/${book}/references`;
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req: Request, _file, cb) => {
    cb(null, req.params.filename);
  },
});
const upload = multer({ storage });

export async function registerUploadReference(router: Router): Promise<void> {
  router.post(
    uploadReferenceService.path,
    upload.single("file"),
    (_req, res) => {
      res.json({ success: true });
    },
  );
}
