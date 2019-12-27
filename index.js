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

bot.on('message', async (message) => {
    const prefix = 'm!'

    let flag = 0;

    if (message.content.startsWith(prefix)) {
        // Remove prefix, then split into tokens using space as delimiter
        const args = message.content.slice(prefix.length).trim().split();
        
        // Grab command (first token) and convert to lowercase
        const cmd = args.shift().toLowerCase();
        
        switch (cmd) {
            case 'ping':
                const msg = await message.channel.send('```🏓 ~ Ping...```');
                await new Promise(r => setTimeout(r, Math.random() * 1000));
                msg.edit('```🏓 ~         Pong!```');
        }
    }
    else
    {
        flag = 1;
    }

    return flag;
});