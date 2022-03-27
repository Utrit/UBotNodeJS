const Discord = require("discord.js")
var command = "ping"
function doCommand(message){
    message.channel.send("pong")
}
module.exports = {doCommand,command}