const Command = require("./Command.js");
const glob = require("glob");
const config = require(__dirname + "/../../database/config.js");


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
    var commandList = [];
    var ignoredList = config.ignored_commands;
    
    glob.sync("./src/*.js").forEach((file) => {
      if (
        !ignoredList.map((command) => "./src/" + command + ".js").includes(file)
      ) {
        commandList.push(require("./" + file.slice(6, -3) + ".js"));
      }
    });

    for (var command in commandList) {
      var com = new commandList[command](threadIDs)
      commandList[command] = com.term + ' ' + com.description + '\n'
    }
 
    // glob.sync("./src/*.js").forEach(function (file) {
    //   if (!ignoredList.map((command) => "./src/" + command + ".js").includes(file)) {
    //     commandList.push(file.slice(6, -3));
    //   }
    // });

    // commandList = commandList.map((command) => "!" + command + "\n");

    for (var command in commandList) {
      this.message.body += commandList[command];
    }

    api.sendMessage(this.message, event.threadID, (err) => {
      //send thread stuff
      if (err) return console.error(err);
    });
  }
};
