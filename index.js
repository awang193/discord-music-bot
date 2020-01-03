require("dotenv").config();
const fs = require("fs");
const jsonfile = require("jsonfile");
const { Client, Collection } = require("discord.js");



// Backup data once every 60s
async function backupLoop() {
    jsonfile.writeFile('./data/servers.json', server_data)
        .catch(err => console.log("<ERROR> Server data write failed! ⛔"));

    jsonfile.writeFile('./data/users.json', user_data)
        .catch(err => console.log("<ERROR> User data write failed! ⛔")); 

    jsonfile.writeFile('./data/playlists.json', playlists)
        .catch(err => console.log("<ERROR> Playlist data write failed! ⛔"));
}

//setInterval(backupLoop, 5000);



// Client settings and data
const client = new Client();
const discord_token = process.env.DISCORD_TOKEN;

client.commands = new Collection();
client.server_data = jsonfile.readFileSync("./data/servers.json");
client.user_data = jsonfile.readFileSync("./data/users.json");
client.playlists = jsonfile.readFileSync("./data/playlists.json");

fs.readdirSync("./handlers/").forEach(handler => {
    require("./handlers/" + handler)(client);
});

//client.commands.forEach(cmd => console.log(JSON.stringify(cmd)));


// On login, show message and log
client.login(discord_token);

client.on("ready", () => {
    console.info(`<SETUP> Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: "online",
        game: {
            name: "development",
            type: "WATCHING"
        }
    });
});

client.on("message", async message => {
    const message_author = message.author.username;
    const server_name = message.guild.name;

    // If the server isn't in data, add it
    if (!client.server_data.hasOwnProperty(server_name)) {
        client.server_data[server_name] = {
            "prefix": "m!",
            "admins": [],
            "disabled_commands": [],
            "aliases": [],
            "queue": [],
        };
        
        console.log(`<DATA> Server data update -> ${JSON.stringify(client.server_data[server_name])}`);
    }

    // Now that server data is loaded, do other checks
    const data = client.server_data[server_name]
    const prefix = data["prefix"]

    if (!message.content.includes(prefix)) return;
    if (message.content.length === 0) return;
    if (!message.content.startsWith(prefix)) return;

    // If user isn't in data, add it
    if (!client.user_data.hasOwnProperty(message_author)) {
        client.user_data[message_author] = {
            "playlists": [],
            "favorite_songs": [],
            "favorite_playlists": [],
        }
        console.log(`<DATA> User data update -> ${message_author + ": " + JSON.stringify(client.user_data[message_author])}`);
    }

    // Message parsing, running commands
    let args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();
    
    const commandToRun = client.commands.get(cmd);

    if (commandToRun) {
        commandToRun.run(client, message, args);
        console.log(`<COMMAND> ${commandToRun.name} ran by ${message.author.username}`);
    }
});