const appRoot = require("app-root-path");
const config = require(`${appRoot}/database/config.js`);
const bodyParse = require(`${appRoot}/src/helper/BodyParse.js`)

////////////////////////////////////////////////////EXPORT_OBJECT////////////////////////////////////////////////////

module.exports = class Message {
  constructor(event) {
    return {
      type: event.type,
      senderID: event.senderID,
      ID: event.messageID,
      threadID: event.threadID,
      hasAttachments: (event.attachments && event.attachments.length) > 0,
      isCommand: bodyParse.isCommand(event.body),
      body: bodyParse.parseBody(event.body),
      term: bodyParse.getTerm(event.body)
    };
  }
};
