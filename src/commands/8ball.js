const Command = require("./Command.js");
const fetch = require("node-fetch");
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));


module.exports = class Eightball extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!8ball";
    this.description = "(must be a reply to text)";
    this.type = ["message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    var userQuery = event.messageReply.body.replace(/[`~!@#$%^&*()_|+\-=;:'",.<>\{\}\[\]\\\/]/gi, '');
    var containsQuestion = nlp(userQuery).sentences().isQuestion().length === 1;

    if(containsQuestion) {
      fetch("https://8ball.delegator.com/magic/JSON/" + userQuery)
      .then((res) => res.json())
      .then((result) => {
        this.message.body = result.magic.answer;
        super.send(event, api, this.message);
      });

    } else {
      this.message.body = "Thats not a question, dumbass."
      super.send(event, api, this.message);
    }
  }
};
