const Command = require("./Command.js");
const fetch = require("node-fetch");
const Uwuifier = require("uwuifier");


module.exports = class UwU extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!UwU";
    this.description = " ";
    this.type = ["message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const uwuifier = new Uwuifier();
    this.message = uwuifier.uwuifySentence(event.messageReply.body);

    super.send(event, api, this.message);
  }
};
