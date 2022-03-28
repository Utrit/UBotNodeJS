const Discord = require(`discord.js`)
const toolkit = require(`../toolkit.js`);
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const errcode = {
    "delete": "Удалить сообщение может только тот кто его отправил",
    "reroll": "повторить запрос может только отправитель"
}
const command = "goat"
const syntaxes = "Запрос на картинку козочки"
const tags = ["rating:safe", "ganyu", "1girl"]
const hasInteraction = "true"
function doCommand(message) {
    toolkit.getMessage(tags, message.author, command, true).then((data) => {
        if (data.ready) message.channel.send({ embeds: data.embeds, components: data.components });
        if (!data.ready) message.reply("Аниме не найдено");
    })
}
function doInteraction(interaction, buttoninfo) {
    if (!(interaction.user.id == 198570626082930689 || interaction.user.id == buttoninfo.id)) {
        interaction.reply({ ephemeral: true, content: errcode[buttoninfo.do] })
        return;
    }
    if (buttoninfo.do == "delete") interaction.message.delete();
    if (buttoninfo.do == "reroll") {
        interaction.deferUpdate().then(() => {
            toolkit.getMessage(tags, interaction.user, command, true).then((data) => {
                if (data.ready) interaction.editReply({ embeds: data.embeds, components: data.components });
            })
        })
    }
}
module.exports = { doCommand, command, hasInteraction, doInteraction, syntaxes }