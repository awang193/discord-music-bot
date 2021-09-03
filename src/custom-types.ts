import * as builders from "@discordjs/builders";
import * as djs from "discord.js";
import * as fs from "fs";
import { table } from "table";

export interface Song {
  url: string;
  requester: djs.Snowflake;
}

export interface MoobotCommand {
  data: builders.SlashCommandBuilder;
  run: Function;
}

export class MoobotClient extends djs.Client {
  queue: Array<Song>;
  commands: djs.Collection<string, MoobotCommand>;

  constructor() {
    super({
      intents: [djs.Intents.FLAGS.GUILDS],
    });
    this.queue = [];
    this.commands = new djs.Collection();
  }

  getQueue() {
    return this.queue;
  }

  queueSong(requester: string, url: string) {
    this.queue.push({
      requester: requester,
      url: url,
    });
  }

  registerCommand(command: MoobotCommand) {
    this.commands.set(command.data.name, command);
  }

  getCommand(commandName: string) {
    return this.commands.get(commandName);
  }

  async loadCommands() {
    // ASCII Table to check loading of commands
    const tableData = [["Category", "Command", "Loaded?"]];

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
          this.registerCommand(loadedCommand);
          tableData.push([category, loadedCommand.data.name, "✅"]);
        } else {
          throw new Error(
            `Moobot - Command ${command} failed to load, exiting...`
          );
        }
      }
    }

    console.log(table(tableData));
  }
}
