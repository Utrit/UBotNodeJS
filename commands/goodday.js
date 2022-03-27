const Discord = require("discord.js")
const request = require('request');
const Gelbooru = require(`../gelbooru.js`);
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GelbooruApi = new Gelbooru();
const holidays = require('../holidays.json');
const command = "goodday"
const hasInteraction = true;
currHour = 0;
const tags = 'Rating:Safe ganyu 1girl';
const customInfodel = {"call":command,"id":"198570626082930689","do":"delete"}
const rowButton = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setLabel('Удалить')
            .setCustomId(JSON.stringify(customInfodel))
            .setStyle('PRIMARY')
    )

function doCommand(message,messageArgs,commandPrototypes){
    if(message.channel==undefined) {checkUpd(message); return;}
    if(message.author.id == "198570626082930689"){
        checkUpd(message.channel,messageArgs[1])
    }
}
function doInteraction(interaction,buttoninfo){
    if (!(interaction.user.id==198570626082930689 || interaction.user.id==buttoninfo.id)) {
        interaction.reply({ephemeral: true, content:errcode[buttoninfo.do]})
        return;
    }
    if (buttoninfo.do=="delete")interaction.message.delete();
}

function checkUpd(message,force){
    var logchannel = message;
    var date = new Date();
    var hour = (date.getHours()+3)%24;
    var month = date.getMonth() + 1;
    var day  = date.getDate();
    console.log(`\x1b[0mмесяц ${month} - день ${day} - час ${hour} currhour=${currHour}`);
    monthHolidays = holidays[month][0]
    dayHoliday = monthHolidays[day]
    if((currHour!=hour && hour=="8") || force=="day")  goodMorrning(dayHoliday,logchannel,hour);
    if((currHour!=hour && hour=="22") || force=="night") goodNight(logchannel,hour);
}

function goodMorrning(dayInfo,logchannel,hour){
    console.log("Доброго утреца");
    currHour = hour
    let embed = new MessageEmbed()
      .setColor("#FFD700")
      .setAuthor({ name: "Утра доброго чатик", iconURL: "https://cdn.discordapp.com/attachments/468486255508717588/954022613867438150/d0cnbY2YxoE.png"})
      .setDescription(`${dayInfo}, с праздничком!`)
    logchannel.send({embeds:[embed], components: [rowButton]})
    count = 0;
  }
  
  function goodNight(logchannel,hour){
    console.log("Спокойной ночи");
    currHour = hour
    GelbooruApi.getRandomPost(tags, 10, Math.floor(Math.random() * 87)).then(post => {
    let embed = new MessageEmbed()
      .setColor("#4682B4")
      .setAuthor({ name: "Доброй ночи чатик", iconURL: "https://cdn.discordapp.com/attachments/468486255508717588/954022709455618098/uCOn3W426PSvQ8faPhUKSw.png"})
      .setDescription(`козочка на ночь`)
      .setImage(post.file_url)
    logchannel.send({embeds:[embed], components: [rowButton]})
    count = 0;
  })
  }

module.exports = {doCommand,command,hasInteraction,doInteraction}