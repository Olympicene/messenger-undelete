const Command = require("./Command.js");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");


module.exports = class Dylan extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Dylan";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const mediaDir = path.resolve(appRoot + "/media/dylan.png"); //directory the  file is going to
    var url =
      "https://i.kym-cdn.com/photos/images/original/001/924/672/fc3.jpg";

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
