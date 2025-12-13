import {
  GeneratePronunciationAudioBodyParams,
  GeneratePronunciationAudioPathParameters,
  generatePronunciationAudioService,
} from "../shared/service.generate-pronunciation-audio.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { loadAudioClient } from "./util.model.js";

export class GeneratePronunciationAudioController extends AbstractController<
  GeneratePronunciationAudioBodyParams,
  GeneratePronunciationAudioPathParameters,
  { audioData: string }
> {
  async handler({
    bodyParams,
    pathParams,
  }: {
    bodyParams: GeneratePronunciationAudioBodyParams;
    pathParams: GeneratePronunciationAudioPathParameters;
  }): Promise<{ audioData: string }> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new RouteError(404, "Book not found");
    }
    if (!book.model.audio.voice) {
      throw new RouteError(400, "No audio voice configured");
    }

    const client = await loadAudioClient(book.model);

    const response = await client.chat.completions.create({
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
          content: `You are a professional audiobook narrator.\n\n${book.instructions.audio}\n\nSpeak the following text clearly and naturally as if you read it while reading the book.`,
        },
        {
          role: "user",
          content: `Text to speak: "${bodyParams.text}"`,
        },
      ],
    });

    const audio = response.choices[0].message.audio?.data;
    if (!audio) {
      throw new RouteError(500, "No audio data returned");
    }

    return { audioData: audio };
  }
}

export const generatePronunciationAudioController = new GeneratePronunciationAudioController(
  generatePronunciationAudioService,
);
