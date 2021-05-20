const Command = require("./Command.js");
var path = require("path");
const fs = require("fs");

module.exports = class MyReacts extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!MyReacts";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = true;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");
    var database = JSON.parse(
      fs.readFileSync(databaseDir + "/reactions.json")
    );

    if (/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g.test(super.getContent(event)[0])) {
      super.getName(api, event.senderID, (name) => {
        if (database[name][super.getContent(event)[0]] != undefined) {

          this.message = `You have been sent ${super.getContent(event)[0]} ${database[name][super.getContent(event)[0]]} times`;
          super.send(event, api, this.message);

        } else {

          this.message = 'You have not been reacted to with this emoji.'
          super.send(event, api, this.message);
        }
        
        //console.log(database[name])
      })
    } else {
      this.message = 'Invalid Emoji Arguement.'
      super.send(event, api, this.message);
    }
  }
};
