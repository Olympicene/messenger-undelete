var parseArgs = require("minimist");
var _ = require("lodash");

module.exports = class Args {
  constructor(event) {
    this.event = event;
    this.message = event.body;
    this.ids = [];
  }

  //removes all mentions from args so that it will look like a command line arg
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

    if (args._.length === 0) {
      delete args._;
    }

    if (this.ids.length > 0) {
      args["ids"] = _.uniq(this.ids);
    }

    return args;
  }

  //suprise suprise checks if theres no arguements in the message
  isEmpty() {
    if (Object.keys(this.removeMentions()).length === 0) {
      return true;
    }
    return false;
  }

  //probably should use this for clarity
  getArgs() {
    return this.removeMentions();
  }
};
