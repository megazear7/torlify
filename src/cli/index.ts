import { Command } from "commander";
import { standardAppConfig } from "./util.standard-app-config.js";
import { defaults } from "./util.defaults.js";
import { ask, closeAsk } from "./util.ask.js";
import { ModelTypeOption } from "./type.cli.js";
import { promises as fs } from "fs";
import { createEnvFile } from "./util.create-env-file.js";

const program = new Command();

program
  .command("init")
  .description("Initialize the Torlify app")
  .action(async () => {
    console.log("Initializing the Torlify app...");
    console.log("\nAll models must be compatible with the OpenAI API schema.");
    const appConfig = { ...standardAppConfig };
    console.log(
      `The following models have provided default configurations:\n${Object.keys(defaults).join(", ")}`,
    );
    appConfig.model.text.name = await ask("\nModel name?", defaults.grok.name);
    appConfig.model.text.modelName = await ask(
      "Model identifier?",
      defaults[appConfig.model.text.name as ModelTypeOption]?.modelName,
    );
    appConfig.model.text.endpoint = await ask(
      "Model endpoint?",
      defaults[appConfig.model.text.name as ModelTypeOption]?.endpoint,
    );
    const textApiKey = await ask("Text model API key?");
    appConfig.model.text.cost.inputTokenCost = Number(
      await ask(
        "Input token cost (dollars per 1M tokens)?",
        String(
          defaults[appConfig.model.text.name as ModelTypeOption]?.cost
            .inputTokenCost || 0,
        ),
      ),
    );
    appConfig.model.text.cost.outputTokenCost = Number(
      await ask(
        "Output token cost (dollars per 1M tokens)?",
        String(
          defaults[appConfig.model.text.name as ModelTypeOption]?.cost
            .outputTokenCost || 0,
        ),
      ),
    );

    let audioApiKey = "todo";
    const configureAudio =
      (
        await ask("Do you want to configure an audio model?", "yes")
      ).toLowerCase() === "yes";
    if (configureAudio) {
      appConfig.model.audio.name = await ask(
        "Model name?",
        defaults.openai.name,
      );
      appConfig.model.audio.modelName = await ask(
        "Model identifier?",
        defaults[appConfig.model.audio.name as ModelTypeOption]?.modelName,
      );
      appConfig.model.audio.endpoint = await ask(
        "Model endpoint?",
        defaults[appConfig.model.audio.name as ModelTypeOption]?.endpoint,
      );
      audioApiKey = await ask("Audio model API key?");
      appConfig.model.audio.cost.inputTokenCost = Number(
        await ask(
          "Input token cost (dollars per 1M tokens)?",
          String(
            defaults[appConfig.model.audio.name as ModelTypeOption]?.cost
              .inputTokenCost || 0,
          ),
        ),
      );
      appConfig.model.audio.cost.outputTokenCost = Number(
        await ask(
          "Output token cost (dollars per 1M tokens)?",
          String(
            defaults[appConfig.model.audio.name as ModelTypeOption]?.cost
              .outputTokenCost || 0,
          ),
        ),
      );
    }

    const port = await ask("Port to run the app on?", "3000");

    await fs.writeFile(
      ".env",
      createEnvFile(appConfig, port, textApiKey, audioApiKey),
    );
    await fs.writeFile(
      "data/app/index.json",
      JSON.stringify(appConfig, null, 2),
    );
    console.log("Initialization complete.");
    console.log(
      "Now you can start the app with 'npm start' and open the app in your browser at http://localhost:3000",
    );
    await closeAsk();
  });

program.parse(process.argv);
