const Command = require("./Command.js");
const fetch = require("node-fetch");

module.exports = class DownloadAudio extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!DownloadAudio";
    this.description = " ";
    this.type = ["message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {

    if (event.messageReply.attachments[0].type == 'audio') {
      this.message.body = event.messageReply.attachments[0].url
    } else {
      this.message.body = 'that is not an audio file'
    }

    super.send(event, api, this.message);
  }
};
