const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const COMMAND_NAME = 'list'

function data(subcommand) {
    return subcommand
    .setName(COMMAND_NAME)
    .setDescription('List threads')
}

async function commandHandler(bot, interaction) {
    if(interaction.options.getSubcommand() === COMMAND_NAME) {
        const channel = bot.channels.cache.get(interaction.channelId);
        const activeThreads = await channel.threads.fetchActive();
        
        const memberRequests = activeThreads.threads.map(activeThread => activeThread.members.fetch());

        const memberResponses = await Promise.all(memberRequests);

        const threads = memberResponses
        .filter(memberResponses => memberResponses.has(bot.user.id) && !memberResponses.has(interaction.user.id))
        .map(memberResponse => memberResponse.first().thread)
        
        if(threads.length > 0) {
            const threadOptions = threads.map(
                thread => {
                const menuOption = new StringSelectMenuOptionBuilder()
                    .setLabel(thread.name)
                    .setValue(thread.id)

                if(thread.description) {
                    menuOption.setDescription(thread.description);
                }
                
                return menuOption;
            });
            const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('joinThread')
            .setPlaceholder('Nothing selected')
            .addOptions(threadOptions);
            const actions = new ActionRowBuilder().addComponents(selectMenu);
            await interaction.reply({
                content:`Spoiler threads: ${threads.size === 0 ? '\nNo active spoiler threads' : ''}`, 
                ephemeral: true,
                components: [actions]
            });
        } else {
            await interaction.reply({
                content:'Spoiler threads: \n No active spoiler threads', 
                ephemeral: true
            });
        }
    }
}

module.exports = { data, commandHandler };