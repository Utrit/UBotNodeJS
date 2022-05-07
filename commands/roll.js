const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const {DiceRoller,DiscordRollRenderer}  = require("dice-roller-parser");
const diceRoller = new DiceRoller(null,100);
const renderer = new DiscordRollRenderer();
const config = require("../config.json")
const alials = require("../alials.json");
const command = "roll"
const syntaxes = "Ролы хз почитайте документацию по dice-roller-parser"
const errcode = {
    "delete": "Удалить сообщение может только тот кто его отправил",
    "reroll": "повторить запрос может только отправитель"
}

const hasInteraction = true;
function doCommand(message, messageArgs, commandPrototypes) {
    helpmsg = ""
    messageArgs.shift()
    args = messageArgs
    roll = Array.from(args).join(" ")
    rollObj = diceRoller.roll(roll)
    rollRender = renderer.render(rollObj)
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
        .setAuthor({ name: `Ролл для ${message.author.username}`, iconURL: message.author.avatarURL()})
        .setDescription(`Держи свои кубики 🗿 \n${rollRender}`)
    message.channel.send({ embeds: [embed], components: [rowButton] })
}
function doInteraction(interaction, buttoninfo) {
    if (!(interaction.user.id == 198570626082930689 || interaction.user.id == buttoninfo.id)) {
        interaction.reply({ ephemeral: true, content: errcode[buttoninfo.do] })
        return;
    }
    if (buttoninfo.do == "delete") interaction.message.delete();
}
module.exports = {doCommand, command, hasInteraction, syntaxes,doInteraction}