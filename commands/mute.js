const Command  = require("./../base/Command");

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: "Mute",
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
    if(!member) member = await this.client.awaitReply(message, "What member would you like to mute?", 30000).mentions.users.first();
    console.log(member);
  }
}