const Discord = require(`discord.js`)
const toolkit = require(`../toolkit.js`);
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const errcode = {
    "delete":"Удалить сообщение может только тот кто его отправил",
    "reroll":"повторить запрос может только отправитель"
}
const command = "anime"
const syntaxes = "Запрос на аниме картинку теги с gelbooru"
const help = "формат команды **<!anime tag1 tag2 etc.>**\n так же вы можете использовать спец теги \n**<{tag1 ~ tag2 ~ etc.}>** означает что тег будет или тот или другой\n**<-tag1>** убрать тег из выдачи\n**<\\*tag1>,<tag1\\*>** позволяет написать тег неточно(например только часть имени)\n**<score:>150>** найти изображение с оценкой > 150\n**<tыg1~>** найдет примерное совпадение"
const hasInteraction = "true"
function doCommand(message,args){
    args.shift();
    toolkit.getMessage(args,message.author,command,true).then((data)=>{
    if(data.ready)message.channel.send({embeds:data.embeds,components:data.components});
    if(!data.ready)message.reply("Аниме не найдено");
    })
}
function doInteraction(interaction,buttoninfo){
    if (!(interaction.user.id==198570626082930689 || interaction.user.id==buttoninfo.id)) {
        interaction.reply({ephemeral: true, content:errcode[buttoninfo.do]})
        return;
    }
    if (buttoninfo.do=="delete")interaction.message.delete();
    if (buttoninfo.do=="reroll"){
        let tags = interaction.message.embeds[0].description.split('`')[1].split(` `)
        interaction.deferUpdate().then(()=>{
        toolkit.getMessage(tags,interaction.user,command,true).then((data)=>{
            if(data.ready)interaction.editReply({embeds:data.embeds,components:data.components}).catch((err)=>toolkit.loginfo(err));
        })
        })
    }
}
module.exports = {doCommand,command,hasInteraction,doInteraction,syntaxes,help}