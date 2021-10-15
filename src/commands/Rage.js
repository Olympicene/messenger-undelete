const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
var fs = require("fs");


module.exports = class Rage extends Command {
  constructor() {
    super();
    this.description = " ";
    this.arguments = { _: 1 };
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  async doAction(message, send, error, typingIndicator) {
    //maybe temp but only way i can get the typing indicator
    var stop = typingIndicator(message.threadID);
    var id = setInterval(() => {typingIndicator(message.threadID)}, 5000);

    var files = fs.readdirSync(appRoot + `/media`)
    let chosenFile = files[Math.floor(Math.random() * files.length)]
    this.message.attachment = fs.createReadStream(chosenFile);

    send(this.message, message.threadID);

    
    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }

  
};