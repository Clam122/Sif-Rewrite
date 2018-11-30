const Command  = require("./../base/Command");

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Mute a member",
      usage: "mute @Member [time]",
      category: "Moderation",
      permLevel: "Moderator",
      guildOnly: true,
      aliases: ["m", "suppress"]
    });
  }

  async run(message, args){
    let member = message.mentions.members.first();
    
    if(!member) {
      let collectedMessage = await this.client.awaitReply(message, "What member would you like to mute?", 30000);
      member = collectedMessage.mentions.members.first();
    }

    if(!member) return message.channel.send("You must supply a member");
    if(member.roles.highest.position >= message.member.roles.highest.position) message.channel.send("You may not do that.");
    if(!member.kickable) return message.channel.send("I may not do that.");

    //MuteRole
    let muteRole  = message.guild.roles.find(r => r.name === message.settings.muteRole);
    if(!muteRole) return message.channel.send("You must configure a muted role.");

    console.log(muteRole);
  }
}

module.exports = Mute;