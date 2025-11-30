import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
  CompletionUsage,
} from "openai/resources";
import z, { ZodType } from "zod";
import { readAppConfig } from "./service.app-config.js";
import { loadTextClient } from "./util.model.js";
import { Book } from "../shared/type.book.js";
import { ModelConfigs } from "../shared/type.model.js";
import { promises as fs } from "fs";
import { ONE_HOUR_IN_MS } from "../shared/util.time.js";

interface CompletionWithUsage<T> {
  completion: T;
  usage: CompletionUsage;
}

export async function getCompletion<T>(
  messages: ChatCompletionMessageParam[],
  modelConfigs: ModelConfigs,
  zod?: ZodType<T>,
): Promise<CompletionWithUsage<T>> {
  const debugDir = "debug/submit-prompt";
  const debugFile = `${debugDir}/${Date.now()}-prompt.json`;
  await fs.mkdir(debugDir, { recursive: true });
  const client = await loadTextClient(modelConfigs);
  const input: ChatCompletionCreateParamsNonStreaming = {
    model: modelConfigs.text.modelName,
    messages: messages,
  };

  if (zod) {
    const innerSchema = z.toJSONSchema(zod);
    const jsonSchemaForOpenAI = {
      name: "schema",
      schema: innerSchema,
      strict: true,
    };
    input.response_format = {
      type: "json_schema",
      json_schema: jsonSchemaForOpenAI,
    };
  }

  const files = await fs.readdir(debugDir);
  const now = Date.now();
  for (const file of files) {
    const filePath = `${debugDir}/${file}`;
    if (file.includes("-")) {
      const timestampStr = file.split("-")[0];
      const timestamp = parseInt(timestampStr);
      if (now - timestamp > ONE_HOUR_IN_MS) {
        await fs.unlink(filePath);
      }
    }
  }

  await fs.writeFile(debugFile, JSON.stringify({ input }, null, 2));
  const output = await client.chat.completions.create(input);
  if (!output.choices[0].message.content) {
    throw new Error("No response");
  }

  await fs.writeFile(debugFile, JSON.stringify({ input, output }, null, 2));

  if (zod) {
    return {
      completion: zod.parse(JSON.parse(output.choices[0].message.content)),
      usage: output.usage!,
    };
  } else {
    return {
      completion: output.choices[0].message.content as T,
      usage: output.usage!,
    };
  }
}

export async function submitPrompt<T>(
  messages: ChatCompletionMessageParam[],
  zod?: ZodType<T>,
): Promise<T> {
  const app = await readAppConfig();
  const completionWithUsage = await getCompletion(messages, app.model, zod);
  return completionWithUsage.completion;
}

export async function submitBookPrompt<T>(
  book: Book,
  messages: ChatCompletionMessageParam[],
  zod?: ZodType<T>,
): Promise<T> {
  const completionWithUsage = await getCompletion(messages, book.model, zod);
  const completion = completionWithUsage.completion;
  const usage = completionWithUsage.usage;

  if (book.model.text.cost) {
    book.model.text.usage.completion_tokens += usage?.completion_tokens || 0;
    book.model.text.usage.prompt_tokens += usage?.prompt_tokens || 0;
    if (usage && usage.completion_tokens && usage.prompt_tokens) {
      const addedCost =
        usage.completion_tokens *
          (book.model.text.cost.outputTokenCost / 1000000) +
        usage.prompt_tokens * (book.model.text.cost.inputTokenCost / 1000000);
      console.log("Added cost: $" + addedCost.toFixed(2));
    } else {
      console.log("No usage info returned: ", usage);
    }
  }

  return completion;
}
