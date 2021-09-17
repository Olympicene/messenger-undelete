const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
const fs = require('fs');
var path = require("path");


module.exports = class WhoSent extends Command {
  constructor() {
    super();
    this.description = " : Drop a nuke (WIP)";
    this.arguments = { _: 1 };
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  async doAction(message, send, error, typingIndicator) {
    //maybe temp but only way i can get the typing indicator
    var stop = typingIndicator(message.threadID);
    var id = setInterval(() => {typingIndicator(message.threadID)}, 5000);

    //timer or something idk
    const timer = ms => new Promise( res => setTimeout(res, ms));


    const databaseDir = path.resolve(appRoot + `/media/`);
    var messages = JSON.parse(fs.readFileSync(databaseDir + "/dislikes.json"));

    var index = Math.floor(Math.random() * messages.length);

    this.message = messages[index]

    messages.splice(index, 1)

    send(this.message, message.threadID);

    fs.writeFileSync(databaseDir + "/dislikes.json", JSON.stringify(messages, null, "\t"));



    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }
};