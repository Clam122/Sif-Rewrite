const {MessageEmbed} = require("discord.js");

class ModEmbed {
  constructor() {
    this.colors = {
      red: 0xff0000,
      orange:0xff8c00,
      yellow: 0xffff00,
      green: 0x66ff33,
      blue: 0x0033cc,
      indigo: 0xcc00cc,
      violet: 0x660066
    };
  }

  Mute(offender, moderator, reason) {
    let MuteEmbed = new MessageEmbed()
      .setTitle(`<@${offender.user.id}> has been muted.`)
      .setDescription(`**Moderator:** <@${moderator.user.id}>\n\n**Reason:** ${reason}`)
      .setColor(this.colors.orange);
    return MuteEmbed;
  }

  Unmute(offender, moderator) {
    let UnmuteEmbed = new MessageEmbed()
      .setTitle(`<@${offender.user.id}> has been unmuted`)
      .setDescription(`**Moderator:** <@${moderator.user.id}>`)
      .setColor(this.colors.green);
    return UnmuteEmbed;
  }

  Warn(offender, moderator, reason) {
    let WarnEmbed = new MessageEmbed()
      .setTitle(`<@${offender.user.id}> has been warned`)
      .setDescription(`**Moderator:** <@${moderator.user.id}>\n\n**Reason:** ${reason}`)
      .setColor(this.colors.yellow);
    return WarnEmbed;
  }

  Ban(offender, moderator, reason) {
    let BanEmbed = new MessageEmbed()
      .setTitle(`<@${offender.user.id}> has been banned`)
      .setDescription(`**Moderator:** <@${moderator.user.id}>\n\n**Reason:** ${reason}`)
      .setColor(this.colors.red);
    return BanEmbed;
  }

  Kick(offender, moderator, reason) {
    let KickEmbed = new MessageEmbed()
      .setTitle(`<@${offender.user.id}> has been kicked`)
      .setDescription(`**Moderator:** <@${moderator.user.id}>\n\n**Reason:** ${reason}`)
      .setColor(this.colors.red);
    return KickEmbed;
  }
}

module.exports = ModEmbed;