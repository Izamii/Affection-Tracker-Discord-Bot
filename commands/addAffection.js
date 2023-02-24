const { SlashCommandBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-affection')
        .setDescription('Adds a new player to the affection table of an NPC.')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The name of the player character.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('affection')
                .setDescription('The amount of affection to start with.')
                .setRequired(false)),
        async execute(interaction) {
            const player = interaction.options.getString('player');
            const npc = interaction.options.getString('npc');
            const affection = interaction.options.getInteger('affection') || 0;
            await interaction.deferReply({ ephemeral: true });

            affectionData.findOne({name: npc}, async (err, data) => {
                if (err) {
                    console.log(err);
                    await interaction.editReply(`There was an error retrieving the data for ${npc}.`);
                } else {
                    if (data) {
                        if (data.affection[player] !== undefined) {
                            await interaction.editReply(`${player} is already in the affection table for ${npc}.`);
                            return;
                        }
                        data.affection[player] = affection;
                        data.markModified('affection');
                        await data.save();
                        await interaction.editReply(`Added ${player} to the affection table for ${npc} and set their affection to ${affection}.`);
                    } else {
                        await interaction.editReply(`Failed to find data on ${npc}.`);
                    }
                }
            });
        }
}