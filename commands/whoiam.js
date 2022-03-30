const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../config.json")
const alials = require("../alials.json");
const command = "whoiam"
const syntaxes = "Информация об аккаунте"
const help = "еще можно узнать инфу о чужом акке если добавить пинг"
const errcode = {
    "delete": "Удалить сообщение может только тот кто его отправил",
}

const hasInteraction = true;
function doCommand(message, messageArgs, commandPrototypes) {
    if (message.channel.type == "DM") return;
    member = message.guild.members.cache.get(message.author.id);
    if(messageArgs[1]!=undefined)
    member = message.guild.members.cache.get(messageArgs[1].replace(/[^0-9]/ig,''));
    if(member==undefined){
        message.reply("Данный аккаунт не найден")
        return;
    }
    user = member.user
    let customInfodel = {"call":command,"id":message.author.id,"do":"delete"}
    let rowButton = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setLabel('Удалить')
            .setCustomId(JSON.stringify(customInfodel))
            .setStyle('PRIMARY')
    )
    console.log(member.roles.cache.color);
    let embed = new MessageEmbed()
    .setAuthor({ name: `Информация для ${message.author.username}`, iconURL: message.author.avatarURL()})
    .setColor(member.displayHexColor)
    .setImage(user.avatarURL())
    .addField('Имя', user.username)
    .addField('Айди', user.id)
    .addField('Вид аккаунта', `${user.bot ? 'Сбойный ии' : 'Кожаный мешок'}`)
    .addField(`Количество ролей`, `${member.roles.cache.size} - цвет ${member.displayHexColor}`)
    .addField(`Присоединился`, `<${member.joinedAt.toISOString().replace('T', ' ').substr(0, 19)}>`)
    .addField(`Создал аккаунт`, `<${user.createdAt.toISOString().replace('T', ' ').substr(0, 19)}>`)
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