import { ZodType } from "zod";

export function buildNestedObject<T>(
  validator: ZodType<T>,
  path: string,
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): T {
  const keys = path.split(".");
  const result: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = {};
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return validator.parse(result);
}
