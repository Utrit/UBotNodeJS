const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const config = require("../config.json")
const alials = require("../alials.json");
const sphereGif = require('../sphereTool.js')
const allowExtension = ["png","jpg","jpeg","gif"]
const command = "sphere"
const syntaxes = "зашарить @user"
const help = "Создает гифку шара по айди человека"
const errcode = {
    "delete": "Удалить сообщение может только тот кто его отправил",
}

const hasInteraction = true;
async function doCommand(message, messageArgs, commandPrototypes) {
    if (message.channel.type == "DM") return;
    if (messageArgs[1]!=undefined) {
        member = message.guild.members.cache.get(messageArgs[1].replace(/[^0-9]/ig, ''));
        onUser(message,member);
    }
    if (message.attachments['size']!=0) {
        attachedFile = message.attachments.values().next().value['attachment']
        onFile(message,attachedFile)
    }
}

async function onFile(message,attachedFile){
    extension = attachedFile.split('.')
    extension = extension[extension.length-1]
    if(!allowExtension.includes(extension.toLowerCase())) return;
    let animatedGif = await sphereGif(
        attachedFile,
        {
            resolution: 200,
        });
    const file = new MessageAttachment(animatedGif, "pet.gif");
    let customInfodel = { "call": command, "id": message.author.id, "do": "delete" };
    let rowButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Удалить')
                .setCustomId(JSON.stringify(customInfodel))
                .setStyle('PRIMARY')
        )
    let embed = new MessageEmbed()
        .setAuthor({ name: `${message.author.username} шарирует картинку`, iconURL: message.author.avatarURL() })
        .setImage("attachment://pet.gif")
    message.channel.send({ embeds: [embed], components: [rowButton], files: [file] });
}
async function onUser(message,member){
    if (member == undefined) {
        message.reply("Данный аккаунт не найден")
        return;
    }
    user = member.user
    let animatedGif = await sphereGif(
        member.displayAvatarURL({ format: "png", size: 256 }),
        {
            resolution: 200,
        });
    const file = new MessageAttachment(animatedGif, "pet.gif");
    let customInfodel = { "call": command, "id": message.author.id, "do": "delete" };
    let rowButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Удалить')
                .setCustomId(JSON.stringify(customInfodel))
                .setStyle('PRIMARY')
        )
    let embed = new MessageEmbed()
        .setAuthor({ name: `${message.author.username} шарирует ${user.username}`, iconURL: message.author.avatarURL() })
        .setImage("attachment://pet.gif")
    message.channel.send({ embeds: [embed], components: [rowButton], files: [file] });
}
function doInteraction(interaction, buttoninfo) {
    if (!(interaction.user.id == 198570626082930689 || interaction.user.id == buttoninfo.id)) {
        interaction.reply({ ephemeral: true, content: errcode[buttoninfo.do] })
        return;
    }
    if (buttoninfo.do == "delete") interaction.message.delete();
}
module.exports = { doCommand, command, hasInteraction, syntaxes, doInteraction, help }