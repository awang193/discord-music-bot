require('dotenv').config();

const Discord = require('discord.js');
const bot = new Discord.Client();
const discord_token = process.env.DISCORD_TOKEN;

bot.login(discord_token);

bot.on('ready', () => {
    console.info(`Ya boi has logged in as ${bot.user.tag}`);
    bot.user.setPresence({
        status: 'online',
        game: {
            name: 'development',
            type: 'WATCHING'
        }
    });
});

bot.on('message', async (msg) => {
    const prefix = 'm!'

    let flag = 0;

    if (msg.content.startsWith(prefix)) {
        // Remove prefix, then split into tokens using space as delimiter, then shift everything to lowercase
        const args = msg.content.slice(prefix.length).trim().split();
        console.info(`${args}`);
        
        switch (args[0]) {
            case 'ping':
                msg.channel.send('pong!');
        }
    }
    else
    {
        flag = 1;
    }

    return flag;
});