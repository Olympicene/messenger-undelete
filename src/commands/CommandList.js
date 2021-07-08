const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
const fs = require("fs");

module.exports = class CommandList extends Command {
  constructor() {
    super();
    this.description = ": displays list of commands";
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  async doAction(event, api) {
    //honest to god no idea why this works

    let commandList = [];
    let ignoredcommands = config.ignored_commands.map((command) => command + ".js");
    
    fs.readdirSync(__dirname).forEach((file) => {
      if (!ignoredcommands.includes(file)) {
        let term = config.prefix + file.slice(0, -3).toLowerCase();
    
        let command = require("./" + file);
    
        commandList[term] = new command();
      }
    });
    
    for (var command in commandList) {
      commandList[command] =
        command + " " + commandList[command].description + "\n";
    }

    this.message.body = "";

    for (var command in commandList) {
      this.message.body += commandList[command];
    }

    api.sendMessage(this.message, event.threadID, (err) => {
      //send thread stuff
      if (err) return console.error(err);
    });
  }
};