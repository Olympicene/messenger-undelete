const config = require(__dirname + "/../database/config.js");
const fs = require("fs");
const Timeout = require("./commands/Timeout");

////////////////////////////////////////////////////GetCommands////////////////////////////////////////////////////

let commandList = [];
let ignoredList = config.ignored_commands.map((command) => command + ".js");

fs.readdirSync(__dirname + "/commands").forEach((file) => {
  if (!ignoredList.includes(file)) {
    let term = config.prefix + file.slice(0, -3).toLowerCase();

    let command = require("./commands/" + file);

    commandList[term] = new command();
  }
});

console.log(Object.keys(commandList));

////////////////////////////////////////////////////Timeout////////////////////////////////////////////////////

const use = new Timeout(config.timeout_milliseconds);

////////////////////////////////////////////////////Listener////////////////////////////////////////////////////

module.exports = class Listener {
  constructor() {}

  receive(event, api) {
    if (event.threadID != undefined && config.allowed_threads.indexOf(event.threadID) > -1) {
      if (["message", "message_reply"].indexOf(event.type) > -1 && !use.inTimeout(event.threadID)) {
        let term = event.body.split(" ")[0].toLowerCase();

        if (term.charAt(0) === config.prefix) {
          commandList[term].listen(event, api, use)
        }
      }
    }
  }
};
