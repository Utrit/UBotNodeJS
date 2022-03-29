const Discord = require("discord.js")
const request = require('request');
const Gelbooru = require(`./gelbooru.js`);
const filesystem = require(`fs`);
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GelbooruApi = new Gelbooru();
const config = require("./config.json");
const videoExtensions = ["mp4","webm"];
var cursedTags = JSON.parse(filesystem.readFileSync(__dirname + config.cursedTags))
console.log(`List of cursedTags ${cursedTags}`);
function addCursedTag(tag) {
    cursedTags[cursedTags.length] = tag;
    filesystem.writeFileSync(__dirname + config.cursedTags, JSON.stringify(cursedTags))
}
function getTags(args) {
    let result = args[0]
    for (let index = 1; index < args.length; index++) {
        if (args[index] != '') result = result + " " + args[index];
    }
    return result.replace(/[^A-Za-z0-9 _;.:,+*^()\-?{}~<=>]/ig, '');
}
async function getMessage(tags, author, command, safe) {
    findCursedTags = [];
    for (let index = 0; index < tags.length; index++) {
        if (cursedTags.includes(tags[index].replace(/[^A-Za-z]/ig, '')) && safe) {
            console.log(`\x1b[31mcursed tag ${tags[index]} detected`);
            findCursedTags[findCursedTags.length] = tags[index];
            tags[index] = '';
        }
        if (tags[index] == "rating:safe" || tags[index] == "rating:explicit") tags[index] = ''
    }
    if (safe) tags.splice(0, 0, `rating:safe`);
    if (!safe) tags.splice(0, 0, `rating:explicit`);
    tags = getTags(tags)
    let succses = false
    for (let index = 0; index < 10; index++) {
        post = await GelbooruApi.getRandomPost(tags, 10, 1)
        if (post.file_url != undefined && !succses) {
            var extension = post.file_url.split('.')
            var extension = extension[extension.length - 1]
            customInfodel = { "call": command, "id": author.id, "do": "delete" }
            customInforoll = { "call": command, "id": author.id, "do": "reroll" }
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
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('Линк')
                        .setURL(post.file_url)
                        .setStyle('LINK')
                );
            let embed = new MessageEmbed()
                .setColor("#4682B4")
                .setAuthor({ name: `Держи аниме ${videoExtensions.includes(extension)?"видео ":""}${post.id} - ${author.username}, трай:${index}`, iconURL: author.avatarURL() })
                .setDescription(`**Tags**:${post.tags.substring(0, 300)} \n **request**:\`${tags}\` \n*cursedTags*:${findCursedTags}`)
                .setImage(videoExtensions.includes(extension)?post.preview_url:post.file_url)
            succses = true;
            loginfo(`${author.username},${author.id},${command}-find,${post.file_url},-,-,${tags}`)
            return { ready: succses, url: post.file_url, embeds: [embed], components: [rowButton], files: [] };
        }
    }
    return { ready: false };
}
function loginfo(info){
    var timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var log = `${timestamp},${info}`
    console.log("\x1b[36m"+log)
    filesystem.appendFileSync(getlogpath(),log+'\n')
}
function getlogpath(){
    return __dirname+config.logs;
}
module.exports = { getMessage, addCursedTag,loginfo,getlogpath}