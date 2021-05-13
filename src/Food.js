const Command = require("./Command.js");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

module.exports = class Food extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Food";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const mediaDir = path.resolve(__dirname + "/../media/" + `food.png`); //directory the shibe file is going to
    const apiFetch = "https://foodish-api.herokuapp.com/api/"; //api that im calling

    fetch(apiFetch)
    .then((res) => res.json())
    .then((result) => {

      var url = result.image;

      super.downloadFile(url, mediaDir).then(() => {
        this.message.attachment = fs.createReadStream(mediaDir);
        this.send(event, api, this.message);
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
