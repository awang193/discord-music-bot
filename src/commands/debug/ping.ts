import * as builders from "@discordjs/builders";
import * as djs from "discord.js";
import { MoobotClient, MoobotCommand } from "../../custom-types";

const pingCommand: MoobotCommand = {
  data: new builders.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping-pong!"),
  run: async (interaction: djs.CommandInteraction, client: MoobotClient) => {
    interaction.reply("Pong! 🏓");
  },
};

export default pingCommand;
