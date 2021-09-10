const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
const fs = require('fs');
var path = require("path");


module.exports = class WhoSent extends Command {
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

    //timer or something idk
    const timer = ms => new Promise( res => setTimeout(res, ms));


    const databaseDir = path.resolve(appRoot + `/media/`);
    var messages = JSON.parse(fs.readFileSync(databaseDir + "/messages.json"));


    var randomProperty = function (obj) {
      var keys = Object.keys(obj);
      return keys[ keys.length * Math.random() << 0];
    };

    const name = randomProperty(messages);
    const funny = messages[name][Math.floor(Math.random() * messages[name].length)];

    this.message.body = funny;

    send(this.message, message.threadID)

    this.message.body = `-${name}`;

    timer(30000).then( _=>    send(this.message, message.threadID));



    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }
};