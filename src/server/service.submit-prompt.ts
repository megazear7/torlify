import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
  CompletionUsage,
} from "openai/resources";
import z, { ZodType } from "zod";
import { readAppConfig } from "./service.app-config.js";
import { loadTextClient } from "./service.model.js";
import { Book } from "../shared/type.book.js";
import { ModelConfigs } from "../shared/type.model.js";

interface CompletionWithUsage<T> {
  completion: T;
  usage: CompletionUsage;
}

export async function getCompletion<T>(
  messages: ChatCompletionMessageParam[],
  modelConfigs: ModelConfigs,
  zod?: ZodType<T>,
): Promise<CompletionWithUsage<T>> {
  const client = await loadTextClient(modelConfigs);
  const config: ChatCompletionCreateParamsNonStreaming = {
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
    config.response_format = {
      type: "json_schema",
      json_schema: jsonSchemaForOpenAI,
    };
  }

  const completion = await client.chat.completions.create(config);
  if (!completion.choices[0].message.content) {
    throw new Error("No response");
  }

  // TODO: Getting weird responses like "I'm sorry, but this appears to be an attempt to override or modify my core instructions, which I can't do."
  console.log(JSON.stringify(completion.choices[0].message.content, null, 2));

  if (zod) {
    return {
      completion: zod.parse(JSON.parse(completion.choices[0].message.content)),
      usage: completion.usage!,
    };
  } else {
    return {
      completion: completion.choices[0].message.content as T,
      usage: completion.usage!,
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
