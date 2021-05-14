const Command = require("./Command.js");
const SpotifyWebApi = require('spotify-web-api-node');
const fetch = require("node-fetch");



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
