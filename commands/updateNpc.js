const { SlashCommandBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-npc')
        .setDescription('Updates an NPC\'s name and dateability in the database.')
        .addStringOption(option =>
            option.setName('old-name')
                .setDescription('The current name of the NPC.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('new-name')
                .setDescription('The new name of the NPC.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('dateable')
                .setDescription('Whether or not the NPC is dateable.')
                .setRequired(true)),
    async execute(interaction) {
        const oldName = interaction.options.getString('old-name');
        const newName = interaction.options.getString('new-name');
        const dateable = interaction.options.getBoolean('dateable');
        await interaction.deferReply({ ephemeral: true });

        affectionData.findOne({name: oldName}, async (err, data) => {
            if (err) {
                console.log(err);
                await interaction.editReply(`There was an error retrieving the data for ${oldName}.`);
            } else {
                if (data) {
                    data.name = newName;
                    data.dateable = dateable;
                    data.markModified('name');
                    data.markModified('dateable');
                    await data.save();
                    await interaction.editReply(`Updated ${oldName} to ${newName} in the database and set dateable to ${dateable}.`);
                } else {
                    await interaction.editReply(`Failed to find data on ${oldName}.`);
                }
            }
        });
    }
}