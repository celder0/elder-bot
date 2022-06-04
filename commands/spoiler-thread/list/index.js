const COMMAND_NAME = 'list'

function data(subcommand) {
    return subcommand
    .setName(COMMAND_NAME)
    .setDescription('List threads bot has created')
}

async function commandHandler(bot, interaction) {
    if(interaction.options.getSubcommand() === COMMAND_NAME) {
        const channel = bot.channels.cache.get(interaction.channelId);
        const threads = channel.threads.cache.filter(thread => thread.members.cache.filter(thread => !thread.archived).get(bot.user.id))
        await interaction.reply({content:`Spoiler threads: \n${threads.size > 0 ? threads.map(thread => thread.name).join('\n') : 'No active spoiler threads'}`, ephemeral: true});
    }
}

module.exports = { data, commandHandler };