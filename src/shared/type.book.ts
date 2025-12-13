import z from "zod";
import { ModelConfigs, ModelTypeConfig } from "./type.model.js";
import { Cost, Usage } from "./type.prompt.js";

export const BookContentType = z.enum(["outline", "text", "audio"]);
export type BookContentType = z.infer<typeof BookContentType>;

export const BookId = z
  .string()
  .min(3)
  .max(64)
  .describe(
    "The id of the book. This should be all lower case letters and should use dashes instead of spaces. It should be a snakecase version of the title, simplified if neccessary.",
  );
export type BookId = z.infer<typeof BookId>;

export const BookupdatedAt = z
  .number()
  .describe("The timestamp when the book was last edited as provided by Date.now()");
export type BookupdatedAt = z.infer<typeof BookupdatedAt>;

export const BookCreatedAt = z.number().describe("The timestamp when the book was created as provided by Date.now()");
export type BookCreatedAt = z.infer<typeof BookCreatedAt>;

export const BookTitle = z.string().min(1).describe("The title of the book");
export type BookTitle = z.infer<typeof BookTitle>;

export const ChapterCount = z.number().min(1).describe("The number of chapters in the book");
export type ChapterCount = z.infer<typeof ChapterCount>;

export const WordCount = z.number().min(0).describe("The number of words in the book");
export type WordCount = z.infer<typeof WordCount>;

export const TokenCount = z.number().min(0).describe("The number of tokens used to generate the book");
export type TokenCount = z.infer<typeof TokenCount>;

export const TokenCost = z.number().min(0).describe("The total cost of all tokens.");
export type TokenCost = z.infer<typeof TokenCost>;

export const BookMinimalInfo = z.object({
  id: BookId,
  updatedAt: BookupdatedAt.optional(),
  bookCreatedAt: BookCreatedAt.optional(),
  title: BookTitle,
  chapterCount: ChapterCount,
  wordCount: WordCount,
  tokenCount: TokenCount,
  cost: TokenCost,
});
export type BookMinimalInfo = z.infer<typeof BookMinimalInfo>;

export const BookMinimalInfoList = BookMinimalInfo.array();
export type BookMinimalInfoList = z.infer<typeof BookMinimalInfoList>;

export const ReferenceUse = z.enum(["outlining", "writing", "editing", "plot"]);
export type ReferenceUse = z.infer<typeof ReferenceUse>;

export const BookReference = z.object({
  file: z.string().describe("The path to the reference file."),
  instructions: z.string(),
  whenToUse: ReferenceUse.array(),
});
export type BookReference = z.infer<typeof BookReference>;

export const LoadedBookReference = BookReference.extend({
  fileContent: z.string().describe("The file represented as a string"),
});
export type LoadedBookReference = z.infer<typeof LoadedBookReference>;

export const BookOverview = z
  .string()
  .describe(
    "Overview of the book to write. This should contain the story, an overview of the plot, character summaries, plot devices, key moments, background information, and anything else to help set the stage for writing the book.",
  );
export type BookOverview = z.infer<typeof BookOverview>;

export const BookDetails = z.object({
  authorName: z.string().optional(),
  isbn: z.string().optional(),
  dedication: z.string().optional(),
  acknowledgements: z.string().optional(),
  aboutTheAuthor: z.string().optional(),
  includeChapterTitles: z.boolean().optional(),
});
export type BookDetails = z.infer<typeof BookDetails>;

export const BookChapterPartText = z
  .string()
  .describe(
    "A written part of a chapter of the book. This should be plain text written in proper sentences and paragraphs. It should include absolutely no json or markup.",
  );
export type BookChapterPartText = z.infer<typeof BookChapterPartText>;

export const PropertyText = z.string().describe("Content for a property of the book.");
export type PropertyText = z.infer<typeof PropertyText>;

export const BookAudio = z.string().uuid().describe("The audio for a part of a chapter of the book.");
export type BookAudio = z.infer<typeof BookAudio>;

export const BookChapterPartAudio = z.string().uuid().describe("The audio for a part of a chapter of the book.");
export type BookChapterPartAudio = z.infer<typeof BookChapterPartAudio>;

export const ChapterPartTitle = z.string().min(1).describe("The name of the chapter part");
export type ChapterPartTitle = z.infer<typeof ChapterPartTitle>;

export const ChapterPartDescription = z
  .string()
  .describe("Details about the events that take place. This should be plain text without formatting or markdown.");
export type ChapterPartDescription = z.infer<typeof ChapterPartDescription>;

export const ChapterOutline = ChapterPartDescription.array();
export type ChapterOutline = z.infer<typeof ChapterOutline>;

export const ChapterPartLength = z
  .number()
  .min(0)
  .describe(
    "The the number of words of each part for the chapter. It should be short enough for the audio conversion to accurately transcribe the audio but long enough to be a significant portion of the chapter. A suggested number is 600.",
  );
export type ChapterPartLength = z.infer<typeof ChapterPartLength>;

export const ChapterPartNumber = z.number().min(1).describe("The chapter part number starting from 1");
export type ChapterPartNumber = z.infer<typeof ChapterPartNumber>;

export const ChapterPart = z.object({
  number: ChapterPartNumber,
  text: BookChapterPartText,
  audio: BookChapterPartAudio.optional(),
});
export type ChapterPart = z.infer<typeof ChapterPart>;

export const ChapterParts = ChapterPart.array();
export type ChapterParts = z.infer<typeof ChapterParts>;

export const BookChapterText = z.string().describe("A written part of a chapter of the book.");
export type BookChapterText = z.infer<typeof BookChapterText>;

export const BookChapterAudio = z.string().base64().describe("The audio for a part of a chapter of the book.");
export type BookChapterAudio = z.infer<typeof BookChapterAudio>;

export const CreatedChapter = z.object({
  text: BookChapterText,
  audio: BookChapterAudio,
});
export type CreatedChapter = z.infer<typeof CreatedChapter>;

export const ChapterTitle = z.string().describe("The title of the chapter.");
export type ChapterTitle = z.infer<typeof ChapterTitle>;

export const ChapterWhen = z.string().describe("When the chapter takes place in the story.");
export type ChapterWhen = z.infer<typeof ChapterWhen>;

export const ChapterWhere = z.string().describe("Where the chapter takes place in the setting of the book.");
export type ChapterWhere = z.infer<typeof ChapterWhere>;

export const ChapterWhat = z.string().describe("What happens in the chapter. This shoud be as detailed as possible.");
export type ChapterWhat = z.infer<typeof ChapterWhat>;

export const ChapterWhy = z.string().describe("Why the chapter is included in the plot of the book.");
export type ChapterWhy = z.infer<typeof ChapterWhy>;

export const ChapterHow = z.string().describe("Specify what characters perspective is the chapter written from.");
export type ChapterHow = z.infer<typeof ChapterHow>;

export const ChapterWho = z.string().describe("Which characters are involved in the chapter.");
export type ChapterWho = z.infer<typeof ChapterWho>;

export const ChapterMinParts = z.number().min(1).describe("The minumum number of parts for the chapter");
export type ChapterMinParts = z.infer<typeof ChapterMinParts>;

export const ChapterMaxParts = z.number().min(2).describe("The maximum number of parts for the chapter");
export type ChapterMaxParts = z.infer<typeof ChapterMaxParts>;

export const ChapterNumber = z.number().min(1).describe("The chapter number starting from 1");
export type ChapterNumber = z.infer<typeof ChapterNumber>;

export const ChapterStub = z.object({
  number: ChapterNumber,
  title: ChapterTitle,
  when: ChapterWhen,
  where: ChapterWhere,
  what: ChapterWhat,
  why: ChapterWhy,
  how: ChapterHow,
  who: ChapterWho,
});
export type ChapterStub = z.infer<typeof ChapterStub>;

export const Chapter = ChapterStub.extend({
  minParts: ChapterMinParts,
  maxParts: ChapterMaxParts,
  partLength: ChapterPartLength,
  outline: ChapterOutline,
  parts: ChapterParts,
});
export type Chapter = z.infer<typeof Chapter>;

export const ChapterPartial = Chapter.partial();
export type ChapterPartial = z.infer<typeof ChapterPartial>;

export const EditInstructions = z
  .string()
  .describe(
    "Instructions to follow when editing the book. These instructions should not include changes to the plot, storyline, or the order of events. The AI will edit each paragraph individually. These edits should be for things like tone, words to use or not use, and other changes that can be made one paragraph at a time.",
  );
export type EditInstructions = z.infer<typeof EditInstructions>;

export const AudioInstructions = z
  .string()
  .describe(
    "Instructions to follow when creating the book audio. You can include here things like speed, tone, and speaking style.",
  );
export type AudioInstructions = z.infer<typeof AudioInstructions>;

export const Instructions = z.object({
  edit: EditInstructions.optional(),
  audio: AudioInstructions.optional(),
});
export type Instructions = z.infer<typeof Instructions>;

export const PronunciationMatch = z
  .string()
  .describe("Text to match on when looking for words to change in order to control the pronunciation in the audio.");
export type PronunciationMatch = z.infer<typeof PronunciationMatch>;

export const PronunciationReplace = z
  .string()
  .describe("Text to replace the match with in order to control the pronunciation in the audio.");
export type PronunciationReplace = z.infer<typeof PronunciationReplace>;

export const Pronunciation = z.object({
  match: PronunciationMatch,
  replace: PronunciationReplace,
});
export type Pronunciation = z.infer<typeof Pronunciation>;

export const CharacterName = z.string().describe("The name of the character");
export type CharacterName = z.infer<typeof CharacterName>;

export const CharacterInstructions = z
  .string()
  .describe(
    "Instructions for how this character should behave, their personality, background, and any other relevant details for writing their parts.",
  );
export type CharacterInstructions = z.infer<typeof CharacterInstructions>;

export const Character = z.object({
  name: CharacterName,
  instructions: CharacterInstructions,
});
export type Character = z.infer<typeof Character>;

export const LoadingMessageContent = z.string();
export type LoadingMessageContent = z.infer<typeof LoadingMessageContent>;

export const LoadingMessage = z.string();
export type LoadingMessage = z.infer<typeof LoadingMessage>;

export const LoadingMessages = LoadingMessage.array();
export type LoadingMessages = z.infer<typeof LoadingMessages>;

export const BookStub = z
  .object({
    id: BookId,
    title: BookTitle,
    overview: BookOverview,
    chapters: ChapterStub.array(),
    instructions: Instructions,
    pronunciation: Pronunciation.array(),
    characters: Character.array(),
  })
  .strict();
export type BookStub = z.infer<typeof BookStub>;

export const Book = BookStub.extend({
  updatedAt: BookupdatedAt.optional(),
  createdAt: BookCreatedAt.optional(),
  chapters: Chapter.array(),
  loadingMessages: LoadingMessages,
  model: ModelConfigs,
  details: BookDetails.optional(),
  references: BookReference.array().describe("A list of reference files to use when writing the book."),
});
export type Book = z.infer<typeof Book>;

export const BookPartial = Book.partial().extend({
  model: ModelConfigs.partial()
    .extend({
      text: ModelTypeConfig.partial()
        .extend({
          cost: Cost.partial().optional(),
          usage: Usage.partial().optional(),
        })
        .optional(),
      audio: ModelTypeConfig.partial()
        .extend({
          cost: Cost.partial().optional(),
          usage: Usage.partial().optional(),
        })
        .optional(),
    })
    .optional(),
});
export type BookPartial = z.infer<typeof BookPartial>;

export const Books = Book.array();
export type Books = z.infer<typeof Books>;
