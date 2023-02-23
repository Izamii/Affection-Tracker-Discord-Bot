const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about a given character.')
        .addStringOption(option =>
            option.setName('character-name')
                .setDescription('The name of the character you want to know about.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const characterName = interaction.options.getString('character-name');
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.reply(`This command was run by ${interaction.user.username}, requesting info on ${characterName}.`);
    },
};