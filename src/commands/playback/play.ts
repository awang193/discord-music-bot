import * as builders from "@discordjs/builders";
import * as djs from "discord.js";
import { MoobotClient, MoobotCommand } from "../../custom-types";

const playCommand: MoobotCommand = {
  data: new builders.SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Adds a song of your choice to the queue. Accepts YouTube URLs only."
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The YouTube URL of the song you want to play")
        .setRequired(true)
    ) as builders.SlashCommandBuilder,
  run: async (interaction: djs.CommandInteraction, client: MoobotClient) => {
    const test = new MoobotClient();
    test.queueSong("", "");

    client.queueSong(
      interaction.user.tag,
      interaction.options.data[0].value as string
    );
    interaction.reply("Queued song successfully! ✅");
  },
};

export default playCommand;
