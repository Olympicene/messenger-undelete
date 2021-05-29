const Command = require("./Command.js");
const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");

function databaseDir(thread) {
  return path.resolve(appRoot + `/database/deleted-${thread}.json`);
}

module.exports = class Undelete extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Undelete";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    fs.readFile(databaseDir(event.threadID), (err, data) => {

      //super.getName(api, event.)

    });
  }
};
