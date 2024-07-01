const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, GuildFeature } = require('discord.js');

function data(subcommand) {
    return subcommand
    .setName('create')
    .setDescription('Create thread')
    .addStringOption(option => 
        option
        .setName('name')
        .setDescription('thread name')
        .setRequired(true)
    )
}

async function commandHandler(bot, interaction) {
    if(interaction.options.getSubcommand() === 'create') {
        const threadName = interaction.options.getString('name');
        const channel = bot.channels.cache.get(interaction.channelId);
        
        const canPrivateThread = channel.guild.features.includes(GuildFeature.PrivateThreads);
        const thread = await channel.threads.create({
            name: threadName,
            type: canPrivateThread ? ChannelType.PrivateThread: undefined,
            autoArchiveDuration: 1440,
            reason: `Spoiler thread created by ${interaction.member.displayName}`
        });

        if(thread.joinable) await thread.join();
        
        const join = new ButtonBuilder().setCustomId(`joinThread:${thread.id}`).setLabel('Join').setStyle(ButtonStyle.Primary);
        const actions = new ActionRowBuilder().addComponents(join);
        await interaction.reply({content: `Spoiler thread created: ${threadName}`, components: [actions]});
    }
}

module.exports = { data, commandHandler };