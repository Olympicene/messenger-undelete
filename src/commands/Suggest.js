const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
var FormData = require("form-data");
var fs = require("fs");
const fetch = require("node-fetch");


module.exports = class Suggest extends Command {
  constructor() {
    super();
    this.description = " : reply to an screenshot to get source";
    this.arguments = { _: 1 };
    this.type = ["message_reply_1_attachments"];
    this.message = {};
  }

  async doAction(message, send, error, typingIndicator) {
    //maybe temp but only way i can get the typing indicator
    var stop = typingIndicator(message.threadID);
    var id = setInterval(() => {typingIndicator(message.threadID)}, 5000);

    var imageLocation = '';
    var url = message.messageReply.attachments[0].url;

    if (message.messageReply.attachments[0].type == 'photo') {
      imageLocation = appRoot + `/rage/${Date.now()}.png`;
    } else {
      imageLocation = appRoot + `/rage/${message.messageReply.attachments[0].filename}`;
    }

    await super.downloadFile(url, imageLocation);

    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }
};
