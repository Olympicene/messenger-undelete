const Command = require("./Command.js");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
var appRoot = require('app-root-path');


module.exports = class Soyjack extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Soyjack";
    this.description = "(must be a reply to text)";
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
      const mediaDir = path.resolve(appRoot + "/media/soy.png"); //directory the  file is going to
      var url =
      "https://api.memegen.link/images/custom/_" +
      text +
      ".png?background=https://www.dictionary.com/e/wp-content/uploads/2018/05/soyboy-2.png";

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
