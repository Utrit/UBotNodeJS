const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../config.json")
const alials = require("../alials.json");
const command = "help"
const syntaxes = "Помощь по командам"
const errcode = {
    "delete": "Удалить сообщение может только тот кто его отправил",
    "reroll": "повторить запрос может только отправитель"
}

const hasInteraction = true;
function doCommand(message, messageArgs, commandPrototypes) {
    helpmsg = ""
    arg = ""
    if (messageArgs[1]!=undefined){
        arg = messageArgs[1]
    if (alials[messageArgs[1]]) arg = alials[messageArgs[1]];}
    for (let index = 0; index < commandPrototypes.length; index++) {
        const element = commandPrototypes[index];
        if (element.syntaxes != undefined) helpmsg = helpmsg + `**${config.prefix}${element.command}** - ${element.syntaxes}\n`
        if (arg==element.command && element.help!=undefined){
            helpmsg = `**Подробная информация по использованию:!${arg}**\n${element.help}`
            break;
        }
    }
    helpmsg = helpmsg +`\n *version:${config.version} author:${config.author}*`
    let customInfodel = {"call":command,"id":message.author.id,"do":"delete"}
    let rowButton = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setLabel('Удалить')
            .setCustomId(JSON.stringify(customInfodel))
            .setStyle('PRIMARY')
    )
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
module.exports = { doCommand, command, hasInteraction, syntaxes,doInteraction}