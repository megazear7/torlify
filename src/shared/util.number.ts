import { Book, Chapter, ChapterPart, ChapterPartDescription } from "./type.book";

export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
    currency?: string;
    currencyPosition?: "before" | "after";
  } = {},
): string {
  const {
    decimals = 0,
    thousandsSeparator = ",",
    decimalSeparator = ".",
    currency = "",
    currencyPosition = "before",
  } = options;

  // Handle NaN or invalid numbers
  if (isNaN(value)) return "NaN";

  // Round to specified decimals
  const fixedValue = value.toFixed(decimals);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixedValue.split(".");

  // Add thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  // Construct the number part
  let result = decimals > 0 ? `${formattedInteger}${decimalSeparator}${decimalPart}` : formattedInteger;

  // Add currency symbol
  if (currency) {
    result = currencyPosition === "before" ? `${currency}${result}` : `${result}${currency}`;
  }

  return result;
}

export function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function checkCompletion(book: Book): number {
  if (!book || !book.chapters || book.chapters.length === 0) {
    return 0;
  }

  const totalParts = book.chapters.reduce((sum: number, chapter: Chapter) => {
    return sum + (chapter.parts ? chapter.parts.length : 0);
  }, 0);

  const denominator = totalParts * 2;

  const outlinedParts = book.chapters.reduce((sum: number, chapter: Chapter) => {
    if (chapter.outline && chapter.outline.length > 0) {
      return (
        sum + chapter.outline.filter((outline: ChapterPartDescription) => outline && outline.trim().length > 0).length
      );
    }
    return sum;
  }, 0);

  const writtenParts = book.chapters.reduce((sum: number, chapter: Chapter) => {
    if (chapter.parts && chapter.parts.length > 0) {
      return (
        sum + chapter.parts.filter((part: ChapterPart) => part.text && part.text.trim().length > 0 && part.audio).length
      );
    }
    return sum;
  }, 0);

  const numerator = outlinedParts + writtenParts;

  const completionPercentage = denominator === 0 ? 0 : (numerator / denominator) * 100;

  return Math.round(completionPercentage);
}
