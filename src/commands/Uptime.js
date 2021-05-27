const Command = require("./Command.js");

module.exports = class Uptime extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Uptime";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
  }

  doAction(event, api) {
    this.message.body =
      "Olympicene/messenger-helper uptime: " +
      super.secondsToHms(process.uptime());
    super.send(event, api, this.message);
  }
};
