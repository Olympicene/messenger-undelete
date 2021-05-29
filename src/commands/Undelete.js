const Command = require("./Command.js");
const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");
const fs = require("fs");
var path = require("path");


function databaseDir(thread) {
  return path.resolve(appRoot + `/database/deleted-${thread}.json`);
}

module.exports = class Undelete extends Command {
  constructor() {
    super()
    this.description = "[-h]";
    this.type = ["message", "message_reply"];
    this.message = {}
  }

  doAction(event, api) {
    fs.readFile(databaseDir(event.threadID), (err, data) => {

      //super.getName(api, event.)

    });
  }
};
