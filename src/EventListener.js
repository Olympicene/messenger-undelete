const config = require(__dirname + "/../database/config.js");
const fs = require("fs");
const Timeout = require("./commands/Timeout");

////////////////////////////////////////////////////GetCommands////////////////////////////////////////////////////

let commandList = [];
let ignoredcommands = config.ignored_commands.map((command) => command + ".js");

fs.readdirSync(__dirname + "/commands").forEach((file) => {
  if (!ignoredcommands.includes(file)) {
    let term = config.prefix + file.slice(0, -3).toLowerCase();

    let command = require("./commands/" + file);

    commandList[term] = new command();
  }
});

console.log(Object.keys(commandList));

////////////////////////////////////////////////////GetListeners////////////////////////////////////////////////////

let listenerList = [];
let ignoredlisteners = config.ignored_listeners.map((command) => command + ".js");

fs.readdirSync(__dirname + "/listeners").forEach((file) => {
  if (!ignoredlisteners.includes(file)) {
    let term = file.slice(0, -3).toLowerCase();

    let listener = require("./listeners/" + file);

    listenerList[term] = new listener();
  }
});

console.log(Object.keys(listenerList));

////////////////////////////////////////////////////Timeout////////////////////////////////////////////////////

const use = new Timeout(config.timeout_milliseconds);

////////////////////////////////////////////////////Listener////////////////////////////////////////////////////

module.exports = class Listener {
  constructor() {}

  receive(event, api) {
    if (
      event.threadID != undefined &&
      config.allowed_threads.indexOf(event.threadID) > -1
    ) {
      //get all listeners
      for (let index in listenerList) {
        listenerList[index].listen(event);
      }

      //check if message and if commands are in timeout
      if (["message", "message_reply"].indexOf(event.type) > -1 && !use.inTimeout(event.threadID)) {
        let term = event.body.split(" ")[0].toLowerCase();

        //get command from term
        if (term.charAt(0) === config.prefix) {
          commandList[term].listen(event, api, use)
        }
      }
    }
  }
};
