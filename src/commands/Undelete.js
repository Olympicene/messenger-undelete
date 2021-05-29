const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const Args = require(appRoot + "/src/Args.js");
const config = require(appRoot + "/database/config.js");
const fs = require("fs");
var path = require("path");

function databaseDir(thread) {
  return path.resolve(appRoot + `/database/deleted-${thread}.json`);
}

module.exports = class Undelete extends Command {
  constructor() {
    super();
    this.description = "[-h]";
    this.type = ["message", "message_reply"];
    this.message = {};
    this.args = [""]
  }

  doAction(event, api) {
    var args = new Args(event);

    if (args.isEmpty()) {
      fs.readFile(databaseDir(event.threadID), (err, data) => {
        if (err) return console.error(err);

        var json = JSON.parse(data);

        var attachments = '';

        for (var image in json[0].attachments) {
            attachments += json[0].attachments[image].type + ' ' + (parseInt(image)+1) + ': \n' + json[0].attachments[image].url + '\n\n'
        }

        super.getName(api, json[0].senderID, (name) => {

          this.message.body = `@${name} said at ${super.formatDateTime(json[0].timestamp,-5)}: \n\n` + json[0].body + '\n\n' + attachments;

          this.message.mentions = [{
              tag: "@" + name,
              id: json[0].senderID,
            }];

          api.sendMessage(this.message, event.threadID, (err) => {
              if (err) return console.error(err);
          }, json[0].messageID);
        });
      });
    }


  }
};
