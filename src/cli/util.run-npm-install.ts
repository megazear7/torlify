import { exec } from "child_process";
import util from "util";

export async function runNpmInstall(): Promise<void> {
  const execPromise = util.promisify(exec);
  console.log("Running npm install...");
  try {
    const { stdout, stderr } = await execPromise("npm install", {
      cwd: process.cwd(),
    });
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    console.log("npm install completed successfully.");
  } catch (error) {
    console.error("Error during npm install:", error);
    throw error;
  }
}
