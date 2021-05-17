const Command = require("./Command.js");
var path = require("path");
const fs = require("fs");
const { env } = require("process");


module.exports = class Gpt extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Gpt";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");
    var messages = JSON.parse(fs.readFileSync(databaseDir + "/gpt.json"));

    var index = Math.floor(Math.random() * messages.length)

    this.message = messages[index]

    messages.splice(index, 1)

    super.send(event, api, this.message)

    fs.writeFileSync(databaseDir + "/gpt.json", JSON.stringify(messages, null, "\t"));
  }


};
