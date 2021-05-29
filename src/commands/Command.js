const fetch = require("node-fetch");
var path = require("path");
const fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");
var parseArgs = require("minimist");

module.exports = class Commands {
  constructor() {}

  listen(event, api, use) {
    if (this.typeIsCorrect(event)) {
      try {
        this.doAction(event, api);
        use.threadTimeout(event.threadID);
      } catch (e) {
        console.error(e);
      }
    }
  }

  doAction(event, api) {
    //abstract
    throw "Abstract method not implemented";
  }

  typeIsCorrect(event) {
    //check if message type and term is valid
    if (this.type.indexOf(event.type) > -1) {
      return true;
    }
    return false;
  }

  getContent(event) {
    //gets added content of command
    return parseArgs(event.body.split(" ").slice(1));
  }

  getName(api, id, fn) {
    api.getUserInfo(id, (err, ret) => {
      if (err) return console.error(err);
      fn(ret[id].name);
    });
  }

  async downloadFile(url, path) {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
  }

  async send(event, api, message) {
    await new Promise((resolve) => {
      api.sendMessage(message, event.threadID, (err) => {
        //send thread stuff
        if (err) return console.error(err);

        resolve();
      });
    });
  }
};
