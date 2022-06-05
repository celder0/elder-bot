const { MessageSelectMenu, MessageActionRow } = require('discord.js');

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
        const threads = activeThreads.threads
            .filter(thread => !thread.archived)
            .filter(async thread => {
                try {
                    const containsBot = await thread.members.fetch(bot.user.id); 
                    const containsUser = await thread.members.fetch(interaction.user.id);
                    return  containsBot && !containsUser;
                } catch (e) {
                    return false;
                }
            })
        
        if(threads.size > 0) {
            const threadOptions = threads.map(
                thread => ({
                    label: thread.name,
                    description: thread.description,
                    value: thread.id,
                })
            );
            const selectMenu = new MessageSelectMenu()
            .setCustomId('joinThread')
            .setPlaceholder('Nothing selected')
            .addOptions(threadOptions);
            const actions = new MessageActionRow().addComponents(selectMenu);
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