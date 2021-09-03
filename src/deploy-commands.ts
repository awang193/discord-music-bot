import * as fs from "fs";
import * as builders from "@discordjs/builders";
import { config } from "dotenv";
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { MoobotCommand } from "./custom-types";

config();

const registerCommands = async () => {
  try {
    if (!process.env.TOKEN || !process.env.CLIENT_ID) {
      throw new Error("DEPLOY - Environment variables were not set properly");
    }

    const slashCommands: Array<builders.SlashCommandBuilder> = [];

    // For each command category
    const categories = await fs.promises.readdir(__dirname + "/commands/");

    for (const category of categories) {
      // Get list of all commands and lazily load each one
      const commands = await fs.promises.readdir(
        __dirname + `/commands/${category}/`
      );

      for (const command of commands) {
        const exports = await import(
          __dirname + `/commands/${category}/${command}`
        );
        const loadedCommand: MoobotCommand = exports.default;

        // If the command name is set, set in the client
        if (loadedCommand) {
          slashCommands.push(loadedCommand.data);
        } else {
          throw new Error(
            `DEPLOY - Command ${command} failed to load, exiting...`
          );
        }
      }
    }

    console.log(slashCommands.map((command) => command.toJSON()));

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: slashCommands.map((command) => command.toJSON()),
    });
    console.log("DEPLOY - Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
};

registerCommands();
