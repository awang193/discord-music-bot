const fs = require('fs');
const asciitable = require('ascii-table')

module.exports = client => {
    // ASCII Table to check loading of commands
    const command_table = new asciitable().setHeading("Command", "Loaded?");

    // For all subdirectories in commands directory
    fs.readdirSync('./commands/').forEach(dir => {
        // Get list of all command js files inside ending in '.js'
        const command_files = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
    
        // For every filename
        for (let file of command_files) {
            // Require the command
            const command = require(`../commands/${dir}/${file}`);
    
            // If the command name is set, set in the client
            if (command.name) {
                client.commands.set(command.name, command);
                command_table.addRow(command.name, '✅');
            } 
            else {
                command_table.addRow(command.name, '⚠');
                continue;
            }
    
            // If the command has aliases, set aliases in the client appropriately
            if (command.aliases && Array.isArray(command)) {
                command.aliases.forEach(client.aliases.set(command.aliases, command.name));
            } 
        }
    });

    // Print command table to show which commands successfully loaded
    console.log(command_table.toString());
};
