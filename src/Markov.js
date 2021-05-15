const Command = require("./Command.js");
const MarkovGen = require('markov-generator');
var path = require("path");
const fs = require("fs");



module.exports = class Markov extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Markov";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");
    var messages = JSON.parse(fs.readFileSync(databaseDir + "/Output.json"));

    var messages = messages[Math.floor(Math.random() * messages.length)]

    let markov = new MarkovGen({
      input: messages,
      minLength: 10
    });

    this.message.body = markov.makeChain();
    
    super.send(event, api, this.message);
  }
};
