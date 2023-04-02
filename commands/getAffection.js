const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');
const {getAffectionEmoji, capitalize} = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-affection')
        .setDescription('Provides information about a given character and their affection level towards a given player.')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The name of the player character.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('npc')
                .setDescription('Name of the NPC.')
                .setRequired(true)),
    async execute(interaction) {
        const player = capitalize(interaction.options.getString('player'));
        const npc = capitalize(interaction.options.getString('npc'));
        await interaction.deferReply();
        affectionData.findOne({name: npc}, async (err, data) => {
            if (err) {
                console.log(err);
                const embed = new EmbedBuilder()
                    .setTitle(`Affection Meter`)
                    .setDescription('There was an error retrieving the affection level.')
                    .setFooter({text: "Heart's Hearald Inc. ♥"})
                    .setColor(0xFC86A7);
                await interaction.editReply({embeds: [embed]});
            } else {
                if (data) {
                    const affection = data.affection;
                    const affectionLevel = affection[player];
                    if (affectionLevel !== undefined) {
                        const embed = new EmbedBuilder()
                            .setTitle(`Affection Meter`)
                            .setDescription(`*Love looks not with the eyes, but with the mind, I wonder how much our fates are\nintertwined~*`)
                            .addFields(
                                {name: player, value: "\u200B", inline: true},
                                {name: getAffectionEmoji(affectionLevel), value: "\u200B", inline: true},
                                {name: npc, value: "\u200B", inline: true})
                            .setFooter({text: "Heart's Hearald Inc. ♥"})
                            .setColor(0xFC86A7);
                        await interaction.editReply({embeds: [embed]});
                    } else {
                        const embed = new EmbedBuilder()
                            .setTitle(`Affection Meter`)
                            .setDescription(`There is no affection level between ${player} and ${npc}.`)
                            .setFooter({text: "Heart's Hearald Inc. ♥"})
                            .setColor(0xFC86A7);
                        await interaction.editReply({embeds: [embed]});
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle(`Affection Meter`)
                        .setDescription(`Failed to find data on ${npc}.`)
                        .setFooter({text: "Heart's Hearald Inc. ♥"})
                        .setColor(0xFC86A7);
                    await interaction.editReply({embeds: [embed]});
                }
            }
        });
    }
}