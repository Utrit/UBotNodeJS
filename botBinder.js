const Discord = require("discord.js");
const holidays = require('./holidays.json');
const Gelbooru = require(`./gelbooru.js`);
const request = require('request');
const config = require("./config.json");
const filesystem = require("fs");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { fstat } = require("fs");
const { EventEmitter } = require("stream");
const client = new Discord.Client({
    intents : [ "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES" ],
    partials : [ "CHANNEL" ]
});
const GelbooruApi = new Gelbooru();
const commandEvent = new EventEmitter;
var commandModules = filesystem.readdirSync(__dirname+config.modulePath);
var commands = [];
console.log(commandModules);
for (let index = 0; index < commandModules.length; index++) {
    commands[index] = require(__dirname+config.modulePath+commandModules[index]);
    console.log(commands[index]);
}

client.login(config.token);

client.once("ready", () => {
    console.log("Ready!");
    for (let index = 0; index < commands.length; index++) {
        commandEvent.on(commands[index].command,commands[index].doCommand)
    }
    console.log(commandEvent);
});
client.on("messageCreate", async message => {
    messageArgs = message.content.split(' ');
    if(!messageArgs[0].startsWith(config.prefix)) return;
    console.log(messageArgs[0].substring(1,messageArgs[0].length));
    commandEvent.emit(messageArgs[0].substring(1,messageArgs[0].length),message)
})