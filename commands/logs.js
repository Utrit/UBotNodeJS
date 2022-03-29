const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../config.json")
const toolkit = require("../toolkit.js")
const command = "logs"
const errcode = {
    "delete": "Удалить сообщение может только тот кто его отправил",
    "reroll": "повторить запрос может только отправитель"
}
const customInfodel = {"call":command,"id":"198570626082930689","do":"delete"}
const rowButton = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setLabel('Удалить')
            .setCustomId(JSON.stringify(customInfodel))
            .setStyle('PRIMARY')
    )

const hasInteraction = true;
function doCommand(message, messageArgs, commandPrototypes) {
    if(message.author.id!=198570626082930689) return;
    let embed = new MessageEmbed()
        .setColor("#FFD700")
        .setAuthor({ name: `Логи для ${message.author.username}`, iconURL: message.author.avatarURL()})
    message.channel.send({ embeds: [embed], components: [rowButton] ,files:[toolkit.getlogpath()]})
}
function doInteraction(interaction, buttoninfo) {
    if (!(interaction.user.id == 198570626082930689 || interaction.user.id == buttoninfo.id)) {
        interaction.reply({ ephemeral: true, content: errcode[buttoninfo.do] })
        return;
    }
    if (buttoninfo.do == "delete") interaction.message.delete();
}
module.exports = { doCommand, command, hasInteraction,doInteraction}