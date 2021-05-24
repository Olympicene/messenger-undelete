const Command = require("./Command.js");
const fetch = require("node-fetch");
var path = require("path");
const fs = require("fs");


module.exports = class Coding extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Coding";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");
    const mediaDir = path.resolve(__dirname + "/../media/" + `coding.png`); //directory the soyjack file is going to
    var codingList = JSON.parse(fs.readFileSync(databaseDir + "/coding.json"));
    

    fetch(codingList[Math.floor(Math.random() * codingList.length)].url)
      .then((res) => res.json())
      .then((result) => {

        var url = result[Math.floor(Math.random() * result.length)].download_url

        super.downloadFile(url, mediaDir)
        .then(() => {
          this.message.attachment = fs.createReadStream(mediaDir); //get download
          super.send(event, api, this.message);
        })
        .catch((err) => {
          console.error(`Could not get data from ${mediaDir} due to ${err}`);
        });
      })
      .catch((err) => {
        console.error(`Could not get data from ${codingList[Math.floor(Math.random() * codingList.length)].url} due to ${err}`);
      });
  }
};
