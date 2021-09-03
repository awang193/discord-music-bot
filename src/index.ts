import * as fs from "fs";
import * as djs from "discord.js";
import { config } from "dotenv";
import { MoobotClient } from "./custom-types";

config();

const client = new MoobotClient();

if (!process.env.TOKEN) {
  throw new Error("STARTUP - Token not defined");
}

// Log in
client.login(process.env.TOKEN);

// On login, show message and log
client.once("ready", async () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
    await client.loadCommands();
  } else {
    throw new Error("Moobot - Client user was not defined");
  }
});

client.on("interactionCreate", async (interaction: djs.Interaction) => {
  console.log(interaction.toJSON());

  if (!interaction.isCommand()) return;

  const command = client.getCommand(interaction.commandName);

  if (command) {
    command.run(interaction, client);
  }
});
