const newrelic = require('newrelic');
const { prefix } = require("./config.json");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, MessageButton, MessageActionRow } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MEMBERS] });

const fs = require("fs");

const token = process.env.TOKEN;

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
        newrelic.noticeError(error);
        interaction.reply({content: "Something weird happened and this command failed!", ephemeral: true});
    }
});

//Token needed in config.json
bot.login(token);

const express = require('express');
const app = express();
app.listen(process.env.PORT, () => {
    console.log("App Listening")
});