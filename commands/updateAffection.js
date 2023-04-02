const { SlashCommandBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');
const {capitalize} = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-affection')
        .setDescription('Updates the affection level between a given player and a given NPC.')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The name of the player character.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('affection-points')
                .setDescription('The affection points to add to the NPC.')
                .setRequired(true)),
    async execute(interaction) {
        const player = capitalize(interaction.options.getString('player'));
        const npc = capitalize(interaction.options.getString('npc'));
        const affectionPoints = interaction.options.getInteger('affection-points');
        await interaction.deferReply({ ephemeral: true });
        const doc = await affectionData.findOne({name: npc});
        if (doc) {
            const affection = doc.affection;
            const affectionLevel = affection[player];
            if (affectionLevel !== undefined) {
                affection[player] = affectionLevel + affectionPoints;
                doc.markModified('affection');
                await doc.save();
                await interaction.editReply(`The affection level between ${player} and ${npc} is now ${affection[player]}.`);
            } else {
                await interaction.editReply(`There is no affection level between ${player} and ${npc}, cannot update.`);
            }
        }
    }
}