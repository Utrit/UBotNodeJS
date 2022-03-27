const Discord = require("discord.js")
const command = "ping"
const hasInteraction = false;
function doCommand(message){
    message.channel.send("pong")
}
module.exports = {doCommand,command,hasInteraction}