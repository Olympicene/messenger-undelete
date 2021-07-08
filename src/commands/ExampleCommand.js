const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");

module.exports = class ExampleCommand extends Command {
  constructor() {
    super();
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  async doAction(message, send, error) {}
};