import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(question: string, defaultAnswer?: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question + (defaultAnswer ? ` (default: ${defaultAnswer})` : "") + ": ", (answer) => {
      resolve(answer || defaultAnswer || "");
    });
  });
}

export async function closeAsk(): Promise<void> {
  rl.close();
}
