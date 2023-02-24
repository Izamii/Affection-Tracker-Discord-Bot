const { SlashCommandBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-affection')
        .setDescription('Deletes a player from the affection table of an NPC.')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The name of the player character.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true)),
        async execute(interaction) {
            const player = interaction.options.getString('player');
            const npc = interaction.options.getString('npc');
            await interaction.deferReply({ ephemeral: true });

            affectionData.findOne({name: npc}, async (err, data) => {
                if (err) {
                    console.log(err);
                    await interaction.editReply(`There was an error retrieving the data for ${npc}.`);
                } else {
                    if (data) {
                        delete data.affection[player];
                        data.markModified('affection');
                        await data.save();
                        await interaction.editReply(`Deleted ${player} from the affection table for ${npc}.`);
                    } else {
                        await interaction.editReply(`Failed to find data on ${npc}.`);
                    }
                }
            });
        }
}