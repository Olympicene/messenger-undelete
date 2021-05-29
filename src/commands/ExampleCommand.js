const Command = require("./Command.js");
const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");


module.exports = class ExampleCommand extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!ExampleCommand";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
  }
};
