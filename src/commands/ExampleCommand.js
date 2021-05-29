const Command = require("./Command.js");
const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");


module.exports = class ExampleCommand extends Command {
  constructor() {
    super()
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.message = {}
  }

  doAction(event, api) {
  }
};
