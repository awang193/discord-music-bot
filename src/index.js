require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Invoke handlers
fs.readdirSync("./handlers/").forEach((handler) => {
  require("./handlers/" + handler)(client);
});

// Log in
const discord_token = process.env.DISCORD_TOKEN;
client.login(discord_token);

// On login, show message and log
client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    status: "online",
    game: {
      name: "development",
      type: "WATCHING",
    },
  });
});

client.on("message", async (message) => {
  const prefix = "m!";

  if (message.content.startsWith(prefix)) {
    // Remove prefix, then split into tokens using space as delimiter
    const args = message.content.slice(prefix.length).trim().split();

    // Grab command (first token) and convert to lowercase
    const cmd = args.shift().toLowerCase();

    let commandToRun = client.commands.get(cmd);

    if (commandToRun) {
      commandToRun.run(client, message, args);
      console.log(
        `<COMMAND> ${commandToRun.name} ran by ${message.author.username}`
      );
    }
  }
});
