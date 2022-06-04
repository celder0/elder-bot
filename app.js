require('newrelic');
const { prefix } = require("./config.json");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, MessageButton, MessageActionRow } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MEMBERS] });

const fs = require("fs");

const token = process.env.TOKEN;
const commands = [];
const commandFiles = fs.readdirSync('./commands', { withFileTypes: true }).filter(file => file.isDirectory());

// Place your client and guild ids here
const clientId = '982441766697467954';
const guildIds = ['980975523175989309', '644627480346492939'];

for (const file of commandFiles) {
	const command = require(`./commands/${file.name}`);
	commands.push(command.data().toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    guildIds.forEach(async(guildId) => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })
})();

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot))
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot))
    }
}

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    try{
        const command = require(`./commands/${interaction.commandName}`);
        await command.commandHandler(bot, interaction);
    } catch (error) {
        console.error(error);
        interaction.reply("Something weird happened and this command failed!");
    }
});

//Token needed in config.json
bot.login(token);

const express = require('express');
const app = express();
app.listen(process.env.PORT, () => {
    console.log("App Listening")
});