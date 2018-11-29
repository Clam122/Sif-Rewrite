/*
  Command class, used for registering commands. Takes in:
  Name - Name of the command
  Description - Description of the command
  Category- Category command is in, used in help command
  Usage - How should the command be used?
  Enabled - Whether the command should be recognized, good for debugging
  Guild Only - Determines where the command can be run
  Aliases - nicknames for command
  permLevel - Who can run it.
*/

class Command {
  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "Miscellaneous",
    usage = "No usage provided.",
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permLevel = "User"
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;