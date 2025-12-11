import ffmpeg from "fluent-ffmpeg";
import { promises as fs, createReadStream } from "fs";
import path from "path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { Book, Chapter } from "../shared/type.book.js";
import { loadAudioClient } from "./util.model.js";
import { getPartAudioPath } from "./util.get-part-audio-path.js";
import { Readable } from "stream";
import { ChatCompletionMessageParam } from "openai/resources.js";

// Set FFmpeg path once at startup
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function getBookAudio(book: Book): Promise<Readable> {
  const audioPaths: string[] = [];
  const audioPath = `data/books/${book.id}/audio/combined.mp3`;

  // Chapter intro
  audioPaths.push(await generateBookIntro(book));
  const longPausePath = await createSilence(2.0);
  audioPaths.push(longPausePath);

  for (const chapter of book.chapters) {
    // Chapter intro
    audioPaths.push(await generateChapterIntro(book, chapter));
    const longPausePath = await createSilence(1.5);
    audioPaths.push(longPausePath);

    for (let i = 0; i < chapter.parts.length; i++) {
      const partNumber = i + 1;
      const part = chapter.parts[i];
      const audioId = part.audio;

      // Skip parts that don't have audio
      if (!audioId) {
        console.warn(`Stopping audio generation at chapter ${chapter.number} part ${partNumber} - no audio available`);

        // Combine whatever audio we have so far and return it
        if (audioPaths.length > 0) {
          try {
            await combineMP3Files(audioPaths, audioPath);
            console.log(audioPaths);
            console.log(`Returning partial audio with ${audioPaths.length} segments`);
            console.log(audioPath);
            return createReadStream(audioPath);
          } catch (err) {
            console.error("Failed to combine partial MP3 files:", err);
            throw err;
          }
        } else {
          throw new Error(
            `No audio available for chapter ${chapter.number} part ${partNumber} and no previous audio to return`,
          );
        }
      }

      audioPaths.push(await getPartAudioPath(book.id, chapter.number, partNumber));

      // Add short pause between parts (except after the last part)
      if (i < chapter.parts.length - 1) {
        const shortPausePath = await createSilence(0.5);
        audioPaths.push(shortPausePath);
      }
    }

    // Add longer pause between chapters (except after the last chapter)
    if (chapter !== book.chapters[book.chapters.length - 1]) {
      const chapterPausePath = await createSilence(2.5);
      audioPaths.push(chapterPausePath);
    }
  }

  try {
    await combineMP3Files(audioPaths, audioPath);
  } catch (err) {
    console.error("Failed to combine MP3 files:", err);
    throw err;
  }

  return createReadStream(audioPath);
}

export async function combineMP3Files(inputFiles: string[], outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    inputFiles.forEach((file) => {
      command.input(file);
    });
    command
      .complexFilter([
        {
          filter: "concat",
          options: { n: inputFiles.length, v: 0, a: 1 },
          inputs: inputFiles.map((_, i) => `${i}:a`),
          outputs: "a",
        },
      ])
      .outputOptions("-map", "[a]")
      .on("stderr", (line) => console.error("[ffmpeg]", line))
      .on("end", () => resolve())
      .on("error", (err) => reject(`Error: ${err.message}`))
      .save(outputFile);
  });
}

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

export async function generateBookIntro(book: Book): Promise<string> {
  const client = await loadAudioClient(book.model);
  const introId = `book_intro`;

  // Check if intro already exists
  const introPath = `data/books/${book.id}/audio/${introId}.mp3`;
  try {
    await fs.access(introPath);
    console.log(`Book intro audio already exists: ${introPath}`);
    return introPath;
  } catch {
    console.log(`Book intro audio does not exist, generating new audio: ${introPath}`);
  }

  if (!book.model.audio.voice) {
    throw new Error("Audio voice not specified in book model");
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a professional audio book narrator. You speak clearly and dramatically. Include natural pauses where appropriate. ${book.instructions.audio}`,
    },
    {
      role: "user",
      content: `Text to speak: ${book.title}`,
    },
    {
      role: "user",
      content: "Please speak the above text exactly as written",
    },
  ];

  console.log("Generating book intro with messages:", messages);

  // Generate book introduction audio
  const introResponse = await client.chat.completions.create({
    model: book.model.audio.modelName,
    modalities: ["text", "audio"],
    max_completion_tokens: 15000,
    audio: {
      voice: book.model.audio.voice,
      format: "mp3",
    },
    messages,
  });

  const introAudio = introResponse.choices[0].message.audio?.data;
  if (!introAudio) {
    throw new Error("No intro audio data returned in the response");
  }
  const introBuffer = Buffer.from(introAudio, "base64");
  await fs.mkdir(`data/books/${book.id}/audio`, { recursive: true });
  await fs.writeFile(introPath, introBuffer);
  console.log(`Book introduction audio saved as ${introPath}`);

  return introPath;
}

export async function generateChapterIntro(book: Book, chapter: Chapter): Promise<string> {
  const client = await loadAudioClient(book.model);
  const introId = `chapter_${chapter.number}_intro`;

  // Check if intro already exists
  const introPath = `data/books/${book.id}/audio/${introId}.mp3`;
  try {
    await fs.access(introPath);
    console.log(`Chapter intro audio already exists: ${introPath}`);
    return introPath;
  } catch {
    console.log(`Chapter intro audio does not exist, generating new audio: ${introPath}`);
  }

  if (!book.model.audio.voice) {
    throw new Error("Audio voice not specified in book model");
  }

  // Generate chapter introduction audio
  const introResponse = await client.chat.completions.create({
    model: book.model.audio.modelName,
    modalities: ["text", "audio"],
    max_completion_tokens: 15000,
    audio: {
      voice: book.model.audio.voice,
      format: "mp3",
    },
    messages: [
      {
        role: "system",
        content: `You are a professional audio book narrator. You speak clearly and dramatically. Include natural pauses where appropriate. ${book.instructions.audio}`,
      },
      {
        role: "user",
        content: book.details?.includeChapterTitles
          ? `Chapter ${chapter.number}: ${chapter.title}...`
          : `Chapter ${chapter.number}...`,
      },
      {
        role: "user",
        content: "Please speak the above text exactly as written",
      },
    ],
  });

  const introAudio = introResponse.choices[0].message.audio?.data;
  if (!introAudio) {
    throw new Error("No intro audio data returned in the response");
  }
  const introBuffer = Buffer.from(introAudio, "base64");
  await fs.mkdir(`data/books/${book.id}/audio`, { recursive: true });
  await fs.writeFile(introPath, introBuffer);
  console.log(`Chapter introduction audio saved as ${introPath}`);

  return introPath;
}

export async function createSilence(duration: number): Promise<string> {
  const silenceId = `silence_${duration}s`;
  const silencePath = `data/app/silence/${silenceId}.mp3`;

  // Check if silence file already exists
  try {
    await fs.access(silencePath);
    console.log(`Silence audio file already exists: ${silencePath}`);
    return silencePath;
  } catch {
    console.log(`Silence audio file does not exist, generating new audio: ${silencePath}`);
  }

  // Ensure directory exists
  await fs.mkdir("data/app/silence", { recursive: true });

  // Generate silence using ffmpeg
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input("anullsrc=r=44100:cl=stereo")
      .inputFormat("lavfi")
      .duration(duration)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .output(silencePath)
      .on("end", () => {
        console.log(`Silence audio generated: ${silencePath} (${duration}s)`);
        resolve();
      })
      .on("error", (err) => {
        console.error("Error generating silence:", err);
        reject(err);
      })
      .run();
  });

  return silencePath;
}
