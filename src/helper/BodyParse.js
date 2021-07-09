const appRoot = require("app-root-path");
const { config } = require("dotenv");
var parseArgs = require("minimist");
const settings = require(`${appRoot}/database/config.js`);


exports.commandArgs2Array = (text) => {
  const re = /^"[^"]*"$/; // Check if argument is surrounded with double-quotes
  const re2 = /^([^"]|[^"].*?[^"])$/; // Check if argument is NOT surrounded with double-quotes

  let arr = [];
  let argPart = null;

  text &&
    text.split(" ").forEach(function (arg) {
      if ((re.test(arg) || re2.test(arg)) && !argPart) {
        arr.push(arg);
      } else {
        argPart = argPart ? argPart + " " + arg : arg;
        // If part is complete (ends with a double quote), we can add it to the array
        if (/"$/.test(argPart)) {
          arr.push(argPart);
          argPart = null;
        }
      }
    });

  return arr;
};

exports.commandParse = (text) => {
  return parseArgs(this.commandArgs2Array(text));
};

exports.isCommand = (text) => {
  var message = this.commandParse(text);

  if (message._[0] == undefined) {
    return false;
  }
  
  return message._[0].charAt(0) == settings.prefix
};

exports.parseBody = (text) => {
  if (this.isCommand(text)) {
    return this.commandParse(text)
  } 

  return text
}

exports.getTerm = (text) => {
  var message = this.commandParse(text);

  if (!this.isCommand(text)) {
    return undefined
  }

  return message._[0]
}

exports.typeFilter = (event) => {
  var type = event.type;

  if((event.messageReply && event.messageReply.attachments.length) > 0) {
    type += `_${event.messageReply.attachments.length}_attachments`
  }

  return type;
}