var parseArgs = require("minimist");
var _ = require('lodash');


module.exports = class Args {
  constructor(event) {
    this.event = event;
    this.message = event.body;
    this.ids = [];
  }

  removeMentions() {
    for (var mention in this.event.mentions) {
      this.ids.push(mention);
      this.message = this.message.replace(this.event.mentions[mention], "");
    }

    let args = parseArgs(
      this.message
        .split(" ")
        .slice(1)
        .filter(function (e) {
          return e;
        })
    );

    if (this.ids.length > 0) {
      args["ids"] = _.uniq(this.ids);
    }

    return args;
  }

  isEmpty() {

    if (
      Object.keys(this.removeMentions()).length === 1 &&
      this.removeMentions()._.length === 0
    ) {
      return true;
    }
    return false;
  }

  getArgs() {
    return this.removeMentions();
  }
};
