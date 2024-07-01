const newrelic = require('newrelic');

async function execute(interaction, bot) {
    try {
        if (interaction.customId) {
            if (interaction.customId.startsWith('joinThread')) {
                let threadId; 
                if(interaction.isStringSelectMenu()) {
                    threadId = interaction.values[0];    
                } else {
                    threadId = interaction.customId.split(':')[1];
                }
                const thread = interaction.channel.threads.cache.get(threadId)
                thread.members.add(interaction.user.id);
                await interaction.reply({ content: `${thread.name} joined!`, ephemeral: true});
            }
        }
    } catch (e) {
        console.error(e);
        newrelic.noticeError(e);
    }
}

module.exports = {name: 'interactionCreate', execute}