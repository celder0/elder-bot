const {SlashCommandBuilder} = require('@discordjs/builders');
const fs = require("fs");

function data() { 
    const slashCommandBuilder = new SlashCommandBuilder()
        .setName('spoiler-thread')
        .setDescription('List, Create, or Join threads');
    const subcommandDirectories = fs.readdirSync('./commands/spoiler-thread', { withFileTypes: true }).filter(file => file.isDirectory());

    for(const directory of subcommandDirectories) {
        const subCommand = require(`./${directory.name}`);
        slashCommandBuilder.addSubcommand(subCommand.data);
    }
    return slashCommandBuilder;
}



async function commandHandler(bot, interaction) {
    if (interaction.commandName === 'spoiler-thread') {
        const subCommand = require(`./${interaction.options.getSubcommand()}`);
        await subCommand.commandHandler(bot, interaction);
    }
}

module.exports = { data, commandHandler };