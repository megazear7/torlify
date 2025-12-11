import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

// Set FFmpeg path once at startup
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Concatenates multiple MP3 files into a single MP3 and returns the result as a Buffer.
 * Uses stream copy (-c copy) for no quality loss when files have compatible parameters.
 *
 * @param inputFiles Array of absolute or relative paths to MP3 files
 * @returns Promise<Buffer> containing the concatenated MP3 data
 */
export async function concatMp3Files(inputFiles: readonly string[]): Promise<Buffer> {
  if (inputFiles.length === 0) {
    throw new Error("No input files provided");
  }

  // Create a temporary text file for the concat demuxer
  const concatListPath = path.join(process.cwd(), `concat-list-${Date.now()}.txt`);
  const absoluteFiles = inputFiles.map((file) => path.resolve(file));
  const fileLines = absoluteFiles.map((file) => `file '${file}'`).join("\n");

  await fs.writeFile(concatListPath, fileLines);

  // Create a temporary output file
  const tempOutputPath = path.join(process.cwd(), `concat-output-${Date.now()}.mp3`);

  try {
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(concatListPath)
        .inputOptions("-f concat")
        .inputOptions("-safe 0") // Allow absolute paths or filenames with spaces
        .outputOptions("-c copy") // Stream copy – no re-encoding
        .output(tempOutputPath)
        .on("start", (cmd: string) => console.log("FFmpeg command:", cmd))
        .on("error", (err: Error) => {
          console.error("FFmpeg error:", err.message);
          reject(err);
        })
        .on("end", () => resolve())
        .run();
    });

    // Read the resulting file into memory
    return fs.readFile(tempOutputPath);
  } finally {
    // Clean up temporary files
    await Promise.all([fs.unlink(concatListPath).catch(() => {}), fs.unlink(tempOutputPath).catch(() => {})]);
  }
}
