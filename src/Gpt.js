const Command = require("./Command.js");
var path = require("path");
const fs = require("fs");


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

  getRandomLine(filename, callback){
    fs.readFile(filename, function(err, data){
      if(err) {
          throw err;
      }

      var lines = data.toString().split('\n');
      
      var line = lines[Math.floor(Math.random()*lines.length)]
  
      callback(line);
   })
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");

    this.getRandomLine(databaseDir + "/gpt_new.txt", (line) => {
      
      this.message.body = line

      super.send(event, api, this.message)
    });
  }


};
