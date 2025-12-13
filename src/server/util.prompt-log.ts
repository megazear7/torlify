import { PromptLog } from "../shared/type.prompt-log.js";
import { promises as fs } from "fs";

export const listPromptLogs = async (): Promise<PromptLog[]> => {
  const debugDir = "data/prompt";
  await fs.mkdir(debugDir, { recursive: true });
  const files = await fs.readdir(debugDir);
  const logs: PromptLog[] = [];
  for (const file of files) {
    if (!file.endsWith("-prompt.json")) continue;
    const filePath = `${debugDir}/${file}`;
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(data);
      const timestamp = parseInt(file.split("-")[0]);
      const log = PromptLog.parse({ timestamp, ...json });
      logs.push(log);
    } catch (error) {
      console.error(`Failed to parse prompt log ${file}:`, error);
    }
  }
  // Sort by timestamp descending (newest first)
  logs.sort((a, b) => b.timestamp - a.timestamp);
  return logs;
};