const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const newrelic = require('newrelic');

module.exports = {
    name: 'ready',
    once: true,
    execute(bot) {
        //Log Bot's username and the amount of servers its in to console
        console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);

        //Set the Presence of the bot user
        bot.user.setActivity('screams', {type:'LISTENING'});

        const token = process.env.TOKEN;

        const commands = [];
        const commandFiles = fs.readdirSync('./commands', { withFileTypes: true }).filter(file => file.isDirectory());

        // Place your client and guild ids here
        const clientId = bot.application.id;
        // const guildIds = ['980975523175989309', '644627480346492939'];
        const guildIds = bot.guilds.cache.map(guild => guild.id);

        for (const file of commandFiles) {
            const command = require(`../commands/${file.name}`);
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
                    console.log('Failed to reload application (/) commands \n ' + error)
                    newrelic.noticeError(error);
                }
            })
        })();
    }
}