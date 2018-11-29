const {Client, Collection} = require("discord.js");
const Enmap  = require("enmap");
const klaw = require("klaw");
const path = require("path");
const readdir = require("util").promisify(require("fs").readdir);

class Sif extends Client {
  constructor(options) {
    //Let discord.js handle these parameters, we don't care.
    super(options);

    //Config and logger.
    this.config = require("../config.js");
    this.logger = require("../modules/logger.js");

    //Commands and aliases.
    this.commands = new Collection();
    this.aliases = new Collection();

    //Settings, stores guild configurations.
    this.settings = new Enmap({ name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true });

    this.wait = require("util").promisify(setTimeout);
  }

  permlevel (message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadCommand (commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand (commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  async clean(client, text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  }

  getSettings (guild) {
    const defaults = this.config.defaultSettings || {};
    const guildData = this.settings.get(guild.id) || {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
    });
    return returnObject;
  }

  writeSettings (id, newSettings) {
    const defaults = this.settings.get("default");
    let settings = this.settings.get(id);
    if (typeof settings != "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    this.settings.set(id, settings);
  }

  async awaitReply (msg, question, limit = 60000) {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }
  async init() {
    klaw("./commands").on("data", (item) => {
      const cmdFile = path.parse(item.path);
      if (!cmdFile.ext || cmdFile.ext !== ".js") return;
      const response = this.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
      if (response) this.logger.error(response);
    });

    const evtFiles = await readdir("./events/");
    this.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
      const eventName = file.split(".")[0];
      this.logger.log(`Loading Event: ${eventName}`);
      const event = new (require(`./../events/${file}`))(this);
      // This line is awesome by the way. Just sayin'.
      this.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`../events/${file}`)];
    });

    this.levelCache = {};
    
    this.levelCache = {};
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
    this.login(this.config.token);
    

    Object.defineProperty(String.prototype, "toProperCase", {
      value: function() {
        return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      }
    });
  }
}

module.exports = Sif;
