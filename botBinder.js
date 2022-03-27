const Discord = require("discord.js");
const holidays = require('./holidays.json');
const filesystem = require("fs");
const config = require("./config.json");
const alials = require("./alials.json");
const { EventEmitter } = require("stream");
const client = new Discord.Client({
    intents : [ "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES" ],
    partials : [ "CHANNEL" ]
});
const commandEvent = new EventEmitter;
const interactionEvent = new EventEmitter;
var commandModules = filesystem.readdirSync(__dirname+config.modulePath);
var commandPrototypes = [];
var logchannel;
console.log("\x1b[32mRegestration commands:");
for (let index = 0; index < commandModules.length; index++) {
    commandPrototypes[index] = require(__dirname+config.modulePath+commandModules[index]);
    console.log(`\x1b[33m${index} - ${commandPrototypes[index].command} registred`);
}
console.log("\x1b[32mRegestration complete");

client.login(config.token);

client.once("ready", () => {
    console.log("\x1b[32mDiscord client ready");
    console.log("\x1b[32mRegestration events");
    for (let index = 0; index < commandPrototypes.length; index++) {
        commandEvent.on(commandPrototypes[index].command,commandPrototypes[index].doCommand)
        console.log(`\x1b[33m${index} - ${commandPrototypes[index].command} registred`);
        if(commandPrototypes[index].hasInteraction){
            interactionEvent.on(commandPrototypes[index].command,commandPrototypes[index].doInteraction)
            console.log(`\x1b[33m${index} - ${commandPrototypes[index].command} interaction registred`);
        }
    }
    console.log("\x1b[32mRegestration complete");
    console.log("Start heartbeat");
    logchannel = client.channels.cache.get("805764161689616454");
    setInterval(() => {
        commandEvent.emit("goodday",logchannel)
    }, 5000);
    console.log("\x1b[32mHeartbeat started");
});
client.on("messageCreate", async message => {
    messageArgs = message.content.toLowerCase().split(' ');
    if(!messageArgs[0].startsWith(config.prefix)) return;
    let command = messageArgs[0].substring(1,messageArgs[0].length);
    if(alials[command]) command = alials[command];
    console.log(`\x1b[36mcall ${command} - by ${message.author.username} id - ${message.author.id}`);
    commandEvent.emit(command,message,messageArgs,commandPrototypes)
})
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
	buttoninfo = JSON.parse(interaction.customId)
    interactionEvent.emit(buttoninfo.call,interaction,buttoninfo)
});