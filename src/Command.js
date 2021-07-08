const fetch = require("node-fetch");
var path = require("path");
const fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");
var parseArgs = require("minimist");

module.exports = class Commands {
  constructor() {}

  //self explanatory just helper functions

  listen(message, send, error, use) {
    if (this.typeIsCorrect(message)) {
      if (this.argumentIsCorrect(message)) {
        try {
          this.doAction(message, send, error);
          use.threadTimeout(message.threadID);
        } catch (err) {
          error(`error starting command: ${err}`, message.threadID, message.ID);
        }
      } else {
        error(`invalid arguments present`, message.threadID, message.ID);
      }
    } else {
      error(
        `incorrect message type: ${message.type}\n` +
          `this command needs: ${this.type}`,
        message.threadID,
        message.ID
      );
    }
  }

  doAction(message, send, error) {
    //abstract
    throw "Abstract method not implemented";
  }

  typeIsCorrect(message) {
    //check if message type and term is valid
    if (this.type.indexOf(message.type) > -1) {
      return true;
    }
    return false;
  }

  argumentIsCorrect(message) {
    //check if message type and term is valid
    for (var option in message.body) {
      if (this.arguments[option] != message.body[option].length) {
        return false;
      }
    }

    return true;
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

  formatDateTime(timeEpoch, offset) {
    timeEpoch = parseInt(timeEpoch);
    var d = new Date(timeEpoch);
    var utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
    var nd = new Date(utc + 3600000 * offset);
    return nd.toLocaleString();
  }

  isInt(value) {
    return (
      !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10))
    );
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }
};
