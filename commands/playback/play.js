const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    category: 'playback',
    run: async (client, message, args) => {
        const server_name = message.guild.name;
        
        args.forEach(url => {
            const lower_url = url.toLowerCase()

            if (!lower_url.startsWith("https://")) return;
            
            if (lower_url.includes("youtube") || lower_url.includes("youtu.be")) {
                ytdl.getInfo(url)
                    .then(info => {
                        client.server_data[server_name]["queue"].push({
                            "name": info[1].title,
                            "url": info[1].video_url
                        });  
                    })
                    .catch(err => console.log(`<YTDL-ERROR> ${err}`)); 
            }
        });

        console.log(`<DEBUG> Current queue: ${JSON.stringify(client.server_data[server_name]["queue"])}`);
    }
};