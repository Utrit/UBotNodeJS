const Discord = require("discord.js")
const toolkit = require(`../toolkit.js`);
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const errcode = {
    "delete":"Удалить сообщение может только тот кто его отправил",
    "reroll":"повторить запрос может только отправитель"
}
const command = "hentai"
const hasInteraction = "true"
const allowedChannels = ["789551446952509473","741034038801858731"]
function doCommand(message,args){
    if(!allowedChannels.includes(message.channel.id)) return;
    args.shift();
    toolkit.getMessage(args,message.author,command,false).then((data)=>{
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
        toolkit.getMessage(tags,interaction.user,command,false).then((data)=>{
            if(data.ready)interaction.message.edit({embeds:data.embeds,components:data.components});
            if(!data.ready)interaction.reply({ephemeral: true, content:`не получилось`})
        })
    }
}
function getTags(args){
    let result = ""
    for (let index = 1; index < args.length; index++) {
        result = result+" "+args[index];
    }
    return result;
}
module.exports = {doCommand,command,hasInteraction,doInteraction}