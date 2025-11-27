import { promises as fs } from "fs";
import {
  BookId,
  BookReference,
  LoadedBookReference,
} from "../shared/type.book.js";
import mammoth from "mammoth";
import TurndownService from "turndown";
import { PdfReader } from "pdfreader";

export async function loadFiles(
  book: BookId,
  ref: BookReference,
): Promise<LoadedBookReference> {
  const filePath = ref.file;
  const extension = filePath.split(".").pop()?.toLowerCase();

  let content: string;

  if (extension === "txt") {
    content = await fs.readFile(
      `data/books/${book}/references/${filePath}`,
      "utf-8",
    );
  } else if (extension === "docx") {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.convertToHtml({ buffer });
    const turndownService = new TurndownService();
    content = turndownService.turndown(result.value);
  } else if (extension === "pdf") {
    const buffer = await fs.readFile(filePath);

    const textItems: string[] = [];
    const reader = new PdfReader();

    await new Promise<void>((resolve, reject) => {
      reader.parseBuffer(buffer, (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          // End of file
          resolve();
        } else if (item.text) {
          textItems.push(item.text);
        }
      });
    });

    content = textItems.join(" ");
  } else {
    // Default to reading as text for unknown extensions
    content = await fs.readFile(filePath, "utf-8");
  }

  return {
    ...ref,
    fileContent: content,
  };
}
