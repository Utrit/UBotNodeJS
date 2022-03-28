const Discord = require("discord.js")
const command = "ping"
const syntaxes = "проверка живости бота"
const hasInteraction = false;
function doCommand(message){
    message.channel.send("pong")
}
module.exports = {doCommand,command,hasInteraction,syntaxes}