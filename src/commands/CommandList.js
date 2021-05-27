const Command = require("./Command.js");
const config = require(__dirname + "/../../database/config.js");
const appRoot = require("app-root-path");
const fs = require("fs");



module.exports = class CommandList extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!CommandList";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    let commandList = [];
    let ignoredcommands = config.ignored_commands.map((command) => command + ".js");

    
    fs.readdirSync(__dirname).forEach((file) => {
      if (!ignoredcommands.includes(file)) {
        commandList.push(require("./" + file));
      }
    });

    for (var command in commandList) {
      var com = new commandList[command]()
      commandList[command] = com.term + ' ' + com.description + '\n'
    }

    for (var command in commandList) {
      this.message.body += commandList[command];
    }

    api.sendMessage(this.message, event.threadID, (err) => {
      //send thread stuff
      if (err) return console.error(err);
    });
  }
};
