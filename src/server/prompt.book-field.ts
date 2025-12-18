import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";
import { bookOutlinePrompt } from "./prompt.book-outline.js";

export const bookFieldPrompt = async (
  book: Book,
  field: string,
  instructions: string,
): Promise<ChatCompletionMessageParam[]> => {
  const fieldPath = field.split(".");
  const currentValue = getCurrentFieldValue(book, fieldPath);
  const fieldDescription = getBookFieldDescription(fieldPath);
  return [
    ...(await bookOutlinePrompt(book)),
    ...(currentValue
      ? [
          {
            role: MessageType.enum.user,
            content: currentValue,
          },
        ]
      : []),
    {
      role: MessageType.enum.user,
      content: instructions.trim(),
    },
    {
      role: MessageType.enum.user,
      content: `The field to generate is "${field}", which has this description: ${fieldDescription}`,
    },
    {
      role: MessageType.enum.user,
      content:
        "Provide a value for the provided field based on the book outline, description, and user instructions. Do not include any explanations, just provide the plain value.",
    },
  ];
};

export const getCurrentFieldValue = (book: Book, fieldPath: string[]): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tmp: any = book;
  for (const segment of fieldPath) {
    tmp = tmp[segment];
  }
  return tmp;
};

export const getBookFieldDescription = (fieldPath: string[]): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tmp: any = Book;
  for (const segment of fieldPath) {
    if (typeof tmp.shape[segment].unwrap === "function") {
      tmp = tmp.shape[segment].unwrap();
    } else {
      tmp = tmp.shape[segment];
    }
  }
  return tmp.description;
};
