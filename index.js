require('dotenv').config();
const Discord = require('discord.js');
const Logs = require('./logs');

const bot = new Discord.Client(); // Bot handler from discord api
let logs = new Logs(); // Log handler

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);

});

/*
Callback responsavel por dar a role de "membro verificado"
para um usuario assim que ele envia uma mensagem no canal #apresentacoes
do servidor do discord do BrAI
*/
bot.on('message', msg => {

  let payload = {
    id: msg.id,
    timestamp: msg.createdTimestamp,
    nickname: msg.member.nickname,
    username: msg.member.user.username,
    user_id: msg.member.user.id,
    bot: msg.member.user.bot,
    roles: msg.member.roles.cache.map(role => role.name),
    channel: msg.channel.name
  }

  logs.registerMessage(payload)

  // Da a role de membro verificado...
  if (msg.channel.name == 'apresentações'){
    var role = msg.member.guild.roles.cache.find(role => role.name === "Membro Verificado");
    msg.member.roles.add(role)
  }

});

bot.on("guildMemberAdd", msg => {
  // console.info(`A user joined:`, msg.user.user_id);

  let payload = {
    user_id: msg.user.id,
    timestamp: msg.joinedTimestamp,
    username: msg.user.username,
    bot: msg.user.bot,
    roles: msg.roles.cache.map(role => role.name),
  }

  logs.memberJoined(payload)
});

bot.on("guildMemberRemove", msg => {

  let payload = {
    user_id: msg.user.id,
    timestamp: msg.joinedTimestamp,
    username: msg.user.username,
    bot: msg.user.bot,
    roles: msg.roles.cache.map(role => role.name),
  }

  logs.memberExited(payload)
});

bot.on("guildMemberUpdate", (oldMember, newMember) => {
  // console.log("Testing our roles...", newMember, '\n\n\n', oldMember)
  let payload = {}
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {

        payload = {
          user_id: newMember.user.id,
          timestamp: Date.now(),
          username: newMember.user.username,
          bot: newMember.user.bot,
          roles: newMember.roles.cache.map(role => role.name),
          old_roles: role.name
        }

        logs.memberRemoveOldRole(payload)
      }
    });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {

        payload = {
          user_id: newMember.user.id,
          timestamp: Date.now(),
          username: newMember.user.username,
          bot: newMember.user.bot,
          roles: newMember.roles.cache.map(role => role.name),
          new_roles: role.name
        }

        logs.memberAddNewRole(payload)
      }
    });
  }
});


// bot.on("presenceUpdate", (oldMember, newMember) => {
//     // console.info(`User ${oldMember.user.username} changed status from ${oldMember.status} to ${newMember.status} on ${newMember.guild}`);
//     // TODO
// });
