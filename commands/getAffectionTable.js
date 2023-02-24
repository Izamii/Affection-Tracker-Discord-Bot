const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-affection-table')
        .setDescription('Provides a table of affection levels between a given NPC and all players.')
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true)),
    async execute(interaction) {
        const npc = interaction.options.getString('npc');
        await interaction.deferReply();

        affectionData.findOne({name: npc}, async (err, data) => {
            if (err) {
                console.log(err);
                const embed = new EmbedBuilder()
                    .setTitle(`Affection Table for ${npc}`)
                    .setDescription('There was an error retrieving the affection level.')
                    .setFooter({text: "Heart's Hearald Inc. ♥"})
                    .setColor(0xFC86A7);
                await interaction.editReply({embeds: [embed]});
            } else {
                if (data) {
                    const affectionTable = data.getAllAffections();
                    const embed = new EmbedBuilder()
                        .setTitle(npc)
                        .setColor(0xFC86A7)
                        .setDescription("*Affection Table*")
                        .setFooter({text: "Heart's Hearald Inc. ♥"});
                    const fields = [];
                    for (const [player] of affectionTable) {
                        fields.push({name: player, value: "\u200B", inline: true});
                    }
                    embed.addFields(fields);
                    await interaction.editReply({embeds: [embed]});
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle(`Affection Table for ${npc}`)
                        .setDescription(`Failed to find data on ${npc}.`)
                        .setFooter({text: "Heart's Hearald Inc. ♥"})
                        .setColor(0xFC86A7);
                    await interaction.editReply({embeds: [embed]});
                }
            }
        });
    }
}