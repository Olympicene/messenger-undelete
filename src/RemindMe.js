const Command = require("./Command.js");
var parse = require("parse-duration");

// !timer set ming

module.exports = class RemindMe extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!RemindMe";
    this.description = "[time] [message]";
    this.type = ["message", "message_reply"];
    this.needContent = true;
  }

  doAction(event, api) {
    var name = "";

    var time = super.getContent(event)[0];

    var reminder = super.getContent(event).slice(1).join(" ");

    if (parse(time) != null && parse(time) > 0 && parse(time) < 2.592e8) {
      //check if time is valid

      api.getUserInfo(event.senderID, (err, ret) => {
        if (err) return console.error(err);

        for (var prop in ret) {
          name = ret[prop].name;
        }

        this.message.body =
          "will remind " +
          name +
          " in " +
          super.secondsToHms(parse(time) / 1000) +
          ' and say: "' +
          reminder +
          '"';

        api.sendMessage(this.message, event.threadID, (err) => {
          //confirm timer was set
          if (err) return console.error(err);
        });

        this.message.body = "@" + name + " " + reminder;

        this.message.mentions = [
          {
            tag: "@" + name,
            id: event.senderID,
          },
        ];

        setTimeout(() => {
          api.sendMessage(this.message, event.threadID, (err) => {
            //send thread stuff
            if (err) return console.error(err);
          });
        }, parse(time));
      });
    } else {
      throw "invalid minute number";
    }
  }

  isNumeric(num) {
    return !isNaN(num);
  }
};
