const { MessageButton, MessageActionRow } = require('discord.js');

function data(subcommand) {
    return subcommand
    .setName('create')
    .setDescription('Create thread')
    .addStringOption(option => 
        option
        .setName('name')
        .setDescription('thread name')
    )
}

async function commandHandler(bot, interaction) {
    if(interaction.options.getSubcommand() === 'create') {
        const threadName = interaction.options.getString('name');
        const channel = bot.channels.cache.get(interaction.channelId);
        
        const canPrivateThread = channel.guild.features.includes('PRIVATE_THREADS');
        const thread = await channel.threads.create({
            name: threadName,
            type: canPrivateThread ? 'GUILD_PRIVATE_THREAD': undefined,
            autoArchiveDuration: 1440,
            reason: `Spoiler thread created by ${interaction.member.displayName}`
        });

        if(thread.joinable) await thread.join();
        
        const join = new MessageButton().setCustomId('joinThread').setLabel('Join').setStyle('PRIMARY');
        const actions = new MessageActionRow().addComponents(join);
        await interaction.reply({content: `Spoiler thread created: ${threadName}`, components: [actions]});
        
        const message = await interaction.fetchReply();
        const filter = i => i.customId === 'joinThread';
        const collector = await message.createMessageComponentCollector({filter});
        collector.on('collect', async i => {
            if (i.customId === 'joinThread') {
                thread.members.add(i.user.id);
            }
        });
    }
}

module.exports = { data, commandHandler };