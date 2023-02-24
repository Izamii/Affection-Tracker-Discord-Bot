const { SlashCommandBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-npc')
        .setDescription('Deletes an NPC from the database.')
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true)),
    async execute(interaction) {
        const npc = interaction.options.getString('npc');
        await interaction.deferReply({ephemeral: true});

        affectionData.findOneAndDelete({name: npc}, async (err, data) => {
            if (err) {
                console.log(err);
                await interaction.editReply(`There was an error deleting ${npc} from the database.`);
            } else {
                if (data) {
                    await interaction.editReply(`Deleted ${npc} from the database.`);
                } else {
                    await interaction.editReply(`Failed to find data on ${npc}.`);
                }
            }
        });
    }
}