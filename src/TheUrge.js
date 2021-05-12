const Command = require("./Command.js");
const fs = require("fs");
const path = require("path");

module.exports = class TheUrge extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!TheUrge";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const mediaDir = path.resolve(__dirname + "/../media/" + `urge.png`); //directory the shibe file is going to
    var url =
      "https://i.ibb.co/QdZ8BDb/165670278-1353254831738443-1968237180024515079-n.jpg";

    if (fs.existsSync(mediaDir)) {
      this.send(event, api, mediaDir);
    } else {
      super.downloadFile(url, mediaDir).then(() => {
        this.send(event, api, mediaDir);
      });
    }
  }

  send(event, api, mediaDir) {
    this.message.attachment = fs.createReadStream(mediaDir);
    super.send(event, api, this.message);
  }
};
