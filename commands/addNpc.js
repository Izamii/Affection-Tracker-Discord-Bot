const { SlashCommandBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');
const { Types } = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-npc')
        .setDescription('Adds a new NPC to the database.')
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('is-dateable')
                .setDescription('Whether or not the NPC is dateable.')
                .setRequired(true)),
        async execute(interaction) {
            const npc = interaction.options.getString('npc');
            const isDateable = interaction.options.getBoolean('is-dateable');
            await interaction.deferReply({ ephemeral: true });

            const newNpc = new affectionData({
                _id: new Types.ObjectId(),
                name: npc,
                dateable: isDateable,
                affection: {}
            });

            newNpc.save(function (err) {
                if (err) {
                    console.log(err);
                    interaction.editReply(`There was an error adding ${npc} to the database.`);
                } else {
                    interaction.editReply(`Added ${npc} to the database.`);
                }
            });
        }
}