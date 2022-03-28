const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../config.json")
const command = "help"
const syntaxes = "Помощь по командам"
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
    helpmsg = ""
    for (let index = 0; index < commandPrototypes.length; index++) {
        const element = commandPrototypes[index];
        if (element.syntaxes != undefined) helpmsg = helpmsg + `**${config.prefix}${element.command}** - ${element.syntaxes}\n`
    }
    let embed = new MessageEmbed()
        .setColor("#FFD700")
        .setAuthor({ name: `Помощь для ${message.author.username}`, iconURL: message.author.avatarURL()})
        .setDescription(helpmsg)
    message.channel.send({ embeds: [embed], components: [rowButton] })
}
function doInteraction(interaction, buttoninfo) {
    if (!(interaction.user.id == 198570626082930689 || interaction.user.id == buttoninfo.id)) {
        interaction.reply({ ephemeral: true, content: errcode[buttoninfo.do] })
        return;
    }
    if (buttoninfo.do == "delete") interaction.message.delete();
}
module.exports = { doCommand, command, hasInteraction, syntaxes,doInteraction }