const Command = require("./Command.js");
const fetch = require("node-fetch");

module.exports = class ExampleCommand extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!ExampleCommand";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    super.send(event, api, this.message);
  }
};
