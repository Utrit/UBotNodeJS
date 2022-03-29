const Discord = require("discord.js");
const holidays = require('./holidays.json');
const filesystem = require("fs");
const config = require("./config.json");
const alials = require("./alials.json");
const toolkit = require("./toolkit.js")
const { Permissions } = require('discord.js');
const { EventEmitter } = require("stream");
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
    partials: ["CHANNEL"]
});
const commandEvent = new EventEmitter;
const interactionEvent = new EventEmitter;
var commandModules = filesystem.readdirSync(__dirname + config.modulePath);
var commandPrototypes = [];
var logchannel;
console.log("\x1b[32mRegestration commands:");
for (let index = 0; index < commandModules.length; index++) {
    commandPrototypes[index] = require(__dirname + config.modulePath + commandModules[index]);
    console.log(`\x1b[33m${index} - ${commandPrototypes[index].command} registred`);
}
console.log("\x1b[32mRegestration complete");

client.login(config.token);

client.once("ready", () => {
    console.log("\x1b[32mDiscord client ready");
    console.log("\x1b[32mRegestration events");
    for (let index = 0; index < commandPrototypes.length; index++) {
        commandEvent.on(commandPrototypes[index].command, commandPrototypes[index].doCommand)
        console.log(`\x1b[33m${index} - ${commandPrototypes[index].command} registred`);
        if (commandPrototypes[index].hasInteraction) {
            interactionEvent.on(commandPrototypes[index].command, commandPrototypes[index].doInteraction)
            console.log(`\x1b[33m${index} - ${commandPrototypes[index].command} interaction registred`);
        }
    }
    console.log("\x1b[32mRegestration complete");
    console.log("Start heartbeat");
    logchannel = client.channels.cache.get("847837964121014302");
    setInterval(() => {
        commandEvent.emit("goodday", logchannel)
    }, 50000);
    console.log("\x1b[32mHeartbeat started");
});
client.on("messageCreate", async message => {
    messageArgs = message.content.toLowerCase().split(' ');
    if (!messageArgs[0].startsWith(config.prefix)) return;
    let command = messageArgs[0].substring(1, messageArgs[0].length);
    if (alials[command]) command = alials[command];

    if (message.channel.type == "DM") {
        toolkit.loginfo(`[${message.author.username}-${message.author.id}]call[${command}]in[${message.channel.type}]args[${messageArgs}]`)
        commandEvent.emit(command, message, messageArgs, commandPrototypes)
    } else if (checkForPermission(message.channel.permissionsFor(client.user))) {
        toolkit.loginfo(`[${message.author.username}-${message.author.id}]call[${command}]in[${message.channel.type}-${message.channel.name}-${message.guild.name}]args[${messageArgs}]`)
        commandEvent.emit(command, message, messageArgs, commandPrototypes)
    }
})
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    buttoninfo = JSON.parse(interaction.customId)
    if (interaction.channel.type == "DM") {
        toolkit.loginfo(`[${interaction.user.username}-${interaction.user.id}]interact[${buttoninfo.call}-${buttoninfo.do}]in[${interaction.channel.type}]`)
        interactionEvent.emit(buttoninfo.call, interaction, buttoninfo)
    } else if (checkForPermission(interaction.channel.permissionsFor(client.user))) {
        toolkit.loginfo(`[${interaction.user.username}-${interaction.user.id}]interact[${buttoninfo.call}-${buttoninfo.do}]in[${interaction.channel.type}-${interaction.channel.name}-${interaction.guild.name}]`)
        interactionEvent.emit(buttoninfo.call, interaction, buttoninfo)
    }
});

function checkForPermission(bitfield) {
    return bitfield.has([Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.VIEW_CHANNEL,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
    Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
    Permissions.FLAGS.EMBED_LINKS])
}