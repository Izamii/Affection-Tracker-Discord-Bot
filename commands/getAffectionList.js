const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const affectionData = require('../database/affectionSchema');
const {capitalize} = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-affection-list')
        .setDescription('Provides a detailed list of a players affection levels with all NPC\'s.')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('Name of the player character.')
                .setRequired(true)),
    async execute(interaction) {
        const player = capitalize(interaction.options.getString('player'));
        await interaction.deferReply({ephemeral: true});

        affectionData.find({}, async (err, data) => {
            if (err) {
                console.log(err);
                const embed = new EmbedBuilder()
                    .setTitle(`Affection List for ${player}`)
                    .setDescription('There was an error retrieving the affection levels.')
                    .setFooter({text: "Heart's Hearald Inc. ♥"})
                    .setColor(0xFC86A7);
                await interaction.editReply({embeds: [embed]});
            } else {
                if (data) {
                    const embed = new EmbedBuilder()
                        .setTitle(player)
                        .setColor(0xFC86A7)
                        .setDescription("*Affection List*")
                        .setFooter({text: "Heart's Hearald Inc. ♥"});
                    const fields = [];
                    for (const npc of data) {
                        const affectionLevel = npc.affection[player];
                        if (affectionLevel !== undefined) {
                            fields.push({name: npc.name, value: affectionLevel.toString(), inline: true});
                        }
                    }
                    embed.addFields(fields);
                    await interaction.editReply({embeds: [embed]});
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle(`Affection List for ${player}`)
                        .setDescription(`Failed to find data on ${player}.`)
                        .setFooter({text: "Heart's Hearald Inc. ♥"})
                        .setColor(0xFC86A7);
                    await interaction.editReply({embeds: [embed]});
                }
            }
        });

    }
}