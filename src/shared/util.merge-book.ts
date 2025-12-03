import { Book, BookPartial } from "./type.book";

export function mergeBookProperties(
  existingBook: Book,
  newBookData: BookPartial,
): Book {
  return {
    ...existingBook,
    ...newBookData,
    instructions: {
      ...existingBook.instructions,
      ...newBookData.instructions,
    },
    model: {
      ...existingBook.model,
      text: {
        ...existingBook.model.text,
        ...newBookData.model?.text,
        cost: {
          ...existingBook.model.text.cost,
          ...newBookData?.model?.text?.cost,
        },
        usage: {
          ...existingBook.model.text.usage,
          ...newBookData?.model?.text?.usage,
        },
      },
      audio: {
        ...existingBook.model.audio,
        ...newBookData.model?.audio,
        cost: {
          ...existingBook.model.audio.cost,
          ...newBookData?.model?.audio?.cost,
        },
        usage: {
          ...existingBook.model.audio.usage,
          ...newBookData?.model?.audio?.usage,
        },
      },
    },
  };
}
