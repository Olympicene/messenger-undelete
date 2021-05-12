const Command = require("./Command.js");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

module.exports = class Shibe extends Command {
  constructor(ids) {
    super(ids);
    this.term = `!Shibe`;
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  async doAction(event, api) {
    const mediaDir = path.resolve(__dirname + "/../media/" + `shibe.png`); //directory the shibe file is going to
    const apiFetch = "http://shibe.online/api/shibes?"; //api that im calling

    fetch(apiFetch)
      .then((res) => res.json())
      .then((result) => {
        var url = result[0]; //url of image

        super.downloadFile(url, mediaDir) //download image
          .then(() => {
            this.message.attachment = fs.createReadStream(mediaDir); //get download
            super.send(event, api, this.message); //send
          })
          .catch((err) => {
            console.error(`Could not get data from ${mediaDir} due to ${err}`);
          });
      })
      .catch((err) => {
        console.error(`Could not get data from ${apiFetch} due to ${err}`);
      });
  }
};
