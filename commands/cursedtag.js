const Discord = require("discord.js")
const toolkit = require(`../toolkit.js`);
const command = "cursed"
const hasInteraction = false;
function doCommand(message,messageArgs,commandPrototypes){
    if(message.author.id != "198570626082930689") return;
    console.log(messageArgs);
    if(messageArgs[2]=="nsfw"){
    toolkit.addCursedTagNSFW(messageArgs[1]);
    }else toolkit.addCursedTag(messageArgs[1]);
    message.reply(`done added:${messageArgs[1]}`)
}
module.exports = {doCommand,command,hasInteraction}