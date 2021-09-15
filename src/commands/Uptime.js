const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");

module.exports = class Uptime extends Command {
  constructor() {
    super();
    this.description = " ";
    this.arguments = { _: 1 };
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  format(seconds) { //formats date time into human readable format
    function pad(s) {
      return (s < 10 ? "0" : "") + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  }

  
  async doAction(message, send, error, typingIndicator) {
    //maybe temp but only way i can get the typing indicator
    var stop = typingIndicator(message.threadID);
    var id = setInterval(() => {
      typingIndicator(message.threadID);
    }, 5000);

    //get the uptime of this program
    var uptime = process.uptime();

    this.message.body = this.format(uptime);

    send(this.message, message.threadID);

    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }
};
