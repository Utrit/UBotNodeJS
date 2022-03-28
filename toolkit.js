const Discord = require("discord.js")
const request = require('request');
const Gelbooru = require(`./gelbooru.js`);
const filesystem = require(`fs`);
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GelbooruApi = new Gelbooru();
const config = require("./config.json")
var cursedTags = JSON.parse(filesystem.readFileSync(__dirname+config.cursedTags))
console.log(`List of cursedTags ${cursedTags}`);
function addCursedTag(tag){
    cursedTags[cursedTags.length]=tag;
    filesystem.writeFileSync(__dirname+config.cursedTags,JSON.stringify(cursedTags))
}
function getTags(args){
    let result = args[0]
    for (let index = 1; index < args.length; index++) {
        if(args[index]!='')result = result+" "+args[index];
    }
    return result.replace(/[^A-Za-z1-9 _;.:,+*^()\-]/ig, '');
}
async function getMessage(tags,author,command,safe)
{
    findCursedTags=[];
        for (let index = 0; index < tags.length; index++) {
            if(cursedTags.includes(tags[index].replace(/[^A-Za-z]/ig,'')) && safe){
                console.log(`\x1b[31mcursed tag ${tags[index]} detected`);
                findCursedTags[findCursedTags.length]=tags[index];
                tags[index]='';
            }
            if(tags[index]=="rating:safe" || tags[index]=="rating:explicit")tags[index]=''
        }
    if(safe)tags.splice(0,0,`rating:safe`);
    if(!safe)tags.splice(0,0,`rating:explicit`);
    console.log(`\x1b[36mSearch for tags:"${tags}"`);
    tags = getTags(tags)
    let succses = false
    for (let index = 0; index < 10; index++) {
        post = await GelbooruApi.getRandomPost(tags,10,Math.floor(Math.random() * 100/((index+1)*(index+1))))
        if (post.file_url != undefined && !succses) {
            customInfodel = {"call":command,"id":author.id,"do":"delete"}
            customInforoll = {"call":command,"id":author.id,"do":"reroll"}
            const rowButton = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('Удалить')
                        .setCustomId(JSON.stringify(customInfodel))
                        .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('Реролл')
                        .setCustomId(JSON.stringify(customInforoll))
                        .setStyle('SECONDARY')
                );
            let embed = new MessageEmbed()
                .setColor("#4682B4")
                .setAuthor({ name: `Держи аниме ${post.id} - ${author.username}, трай:${index}`, iconURL: author.avatarURL() })
                .setDescription(`**Tags**:${post.tags.substring(0, 300)} \n **request**:\`${tags}\` \n*cursedTags*:${findCursedTags}`)
                .setImage(post.file_url)
            succses = true;
            return {ready:succses,url:post.file_url,embeds: [embed] ,components: [rowButton]};
        }
    }
    return{ready:false};
}
module.exports = {getMessage,addCursedTag}