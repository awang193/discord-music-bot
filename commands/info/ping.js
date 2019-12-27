module.exports = {
    name: 'ping',
    category: 'info',
    run: async (client, message, args) => {
        const msg = await message.channel.send('```🏓 Ping~~~```');
        await new Promise(r => setTimeout(r, Math.random() * 1000));
        msg.edit('```🏓        ~~~Pong!```');
    }
};