const Command = require("./Command.js");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

module.exports = class Chad extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Chad";
    this.type = ["message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    var text = super
      .cleanInput(event.messageReply.body)
      .split(" ")
      .join("_")
      .replace(/\/{2,}/g, "/"); //clean split spaces into _ remove all other /
    const mediaDir = path.resolve(__dirname + "/../media/" + `soy.png`); //directory the shibe file is going to
    var url =
      "https://api.memegen.link/images/custom/_" +
      text +
      ".png?background=https://i.kym-cdn.com/entries/icons/facebook/000/026/152/gigachad.jpg";

    super
      .downloadFile(url, mediaDir)
      .then(() => {
        this.message.attachment = fs.createReadStream(mediaDir); //get download
        super.send(event, api, this.message);
      })
      .catch((err) => {
        console.error(`Could not get data from ${mediaDir} due to ${err}`);
      });
  }
};
