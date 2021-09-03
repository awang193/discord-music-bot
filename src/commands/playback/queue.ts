import * as builders from "@discordjs/builders";
import * as djs from "discord.js";
import { table } from "table";
import { MoobotClient, MoobotCommand, Song } from "../../custom-types";

const leftFormatText = (
  text: string,
  length: number,
  padding: number
): string => {
  if (text.length > length - padding) {
    text = text.slice(0, text.length - padding - 3);
    text += "...";
  }
  while (text.length < length) {
    text += " ";
  }
  return text;
};

const queueCommand: MoobotCommand = {
  data: new builders.SlashCommandBuilder()
    .setName("queue")
    .setDescription("Prints out the queue"),
  run: async (interaction: djs.CommandInteraction, client: MoobotClient) => {
    const tableData = [["Requester", "Song URL"]];

    client
      .getQueue()
      .forEach((song: Song) => tableData.push([song.requester, song.url]));

    const message = "```\nQueue:\n" + table(tableData) + "\n```";

    interaction.reply(message);
  },
};

export default queueCommand;
