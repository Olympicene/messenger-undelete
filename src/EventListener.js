const appRoot = require("app-root-path");
const config = require(`${appRoot}/database/config.js`);

const Timeout = require(`${appRoot}/src/Timeout.js`);
const Message = require(`${appRoot}/src/helper/Message.js`);

const fs = require("fs");

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

// let listenerList = [];
// let ignoredlisteners = config.ignored_listeners.map(
//   (command) => command + ".js"
// );

// fs.readdirSync(__dirname + "/listeners").forEach((file) => {
//   if (!ignoredlisteners.includes(file)) {
//     let term = file.slice(0, -3).toLowerCase();

//     let listener = require("./listeners/" + file);

//     listenerList[term] = new listener();
//   }
// });

// console.log(Object.keys(listenerList));

////////////////////////////////////////////////////Timeout////////////////////////////////////////////////////

const use = new Timeout(config.timeout_milliseconds);

////////////////////////////////////////////////////Listener////////////////////////////////////////////////////

module.exports = class Listener {
  constructor() {}

  receive(event, send, error, typingIndicator) {
    var message = new Message(event);

    if (
      message.threadID != undefined &&
      config.allowed_threads.indexOf(message.threadID) > -1
    ) {
      //get all listeners --[temp disabled]
      // for (let index in listenerList) {
      //   listenerList[index].listen(message);
      // }

      //check if message and if commands are in timeout
      if (message.type.slice(0, 7) == `message` && !use.inTimeout(message.threadID)) {
        if (message.isCommand) {
          try {
            commandList[message.term].listen(message, send, error, use, typingIndicator);
          } catch (err) {
            error(
              `invalid command: ${message.term}`,
              message.threadID,
              message.ID
            );
          }
        }
      }
    }
  }
};
