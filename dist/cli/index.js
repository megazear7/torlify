import { Command } from "commander";
import { standardAppConfig } from "./util.standard-app-config.js";
import { defaults } from "./util.defaults.js";
import { ask } from "./util.ask.js";
import { promises as fs } from "fs";
import { createEnvFile } from "./util.create-env-file.js";
import { runNpmInstall } from "./util.run-npm-install.js";
const program = new Command();
program
    .command("init")
    .description("Initialize the Torlify app")
    .action(async () => {
    console.log("Initializing the Torlify app...");
    await runNpmInstall();
    const appConfig = { ...standardAppConfig };
    appConfig.model.text.name = await ask("Model name?", defaults.grok.name);
    appConfig.model.text.endpoint = await ask("Model endpoint?", defaults[appConfig.model.text.name]?.endpoint);
    const textApiKey = await ask("Text model API key?");
    appConfig.model.text.cost.inputTokenCost = Number(await ask("Input token cost (dollars per 1M tokens)?", String(defaults[appConfig.model.text.name]?.cost
        .inputTokenCost)));
    appConfig.model.text.cost.outputTokenCost = Number(await ask("Output token cost (dollars per 1M tokens)?", String(defaults[appConfig.model.text.name]?.cost
        .outputTokenCost)));
    appConfig.model.audio.name = await ask("Model name?", defaults.openai.name);
    appConfig.model.audio.endpoint = await ask("Model endpoint?", defaults[appConfig.model.audio.name]?.endpoint);
    const audioApiKey = await ask("Audio model API key?");
    appConfig.model.audio.cost.inputTokenCost = Number(await ask("Input token cost (dollars per 1M tokens)?", String(defaults[appConfig.model.audio.name]?.cost
        .inputTokenCost)));
    appConfig.model.audio.cost.outputTokenCost = Number(await ask("Output token cost (dollars per 1M tokens)?", String(defaults[appConfig.model.audio.name]?.cost
        .outputTokenCost)));
    await fs.writeFile(".env", createEnvFile(appConfig, textApiKey, audioApiKey));
    await fs.writeFile("data/app/index.json", JSON.stringify(appConfig, null, 2));
    console.log("Initialization complete.");
    console.log("Now you can start the app with 'npm start'");
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map