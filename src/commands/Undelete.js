const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const Args = require(appRoot + "/src/Args.js");
const config = require(appRoot + "/database/config.js");
const nodeHtmlToImage = require("node-html-to-image");
const util = require("util");
const fs = require("fs");
var path = require("path");

const readFilePromise = util.promisify(fs.readFile);

function databaseDir(thread) {
  return path.resolve(appRoot + `/database/deleted-${thread}.json`);
}

module.exports = class Undelete extends Command {
  constructor() {
    super();
    this.description = "[-h]";
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  async doAction(event, api) {

    //do not delete these i swear to god
    this.message.body = "";
    this.message.mentions = [];
    this.message.attachment = [];

    let args = new Args(event);

    let check = (list, target) => target.every((v) => list.includes(v));
    let argsList = args.removeMentions();

    if (Object.keys(argsList).length === 0) {
      try {
        const data = await readFilePromise(databaseDir(event.threadID));

        let json = JSON.parse(data);
  
        this.getMessage(event, api, json[0]);
      } catch (err) {
        console.error(err);
      }
    } else if (check(["h"], Object.keys(argsList)) && argsList.h === true) {

      this.message.body = `
      Usage:
        !undelete : returns the last deleted message
        !undelete [-h] : help
        !undelete [-a] : returns all deleted messages
        !undelete --message : find by regular messages
        !undelete --message_reply : find by regular message replies
        !undelete --minutes=<time in minutes> : find by how many minutes ago
        !undelete --attachment={photo | video} : find by attachment type
        !undelete --timestamp=<timestamp> : find by timestamp
        !undelete @<FirstName LastName> : find by senderID
      `;
      super.send(event, api, this.message);

    } else if (check(["a"], Object.keys(argsList)) && argsList.a === true) {
      try {
        const data = await readFilePromise(databaseDir(event.threadID));

        let json = JSON.parse(data);
  
        this.sendTable(event, api, json);
      } catch (err) {
        console.error(err);
      }
    } else if (
      check(["ids", "message", "message_reply", "minutes", "attachment", "timestamp"], Object.keys(argsList))
    ) {
      try {
        const data = await readFilePromise(databaseDir(event.threadID));

        var json = JSON.parse(data);

        //filter by sender id
        if (argsList.hasOwnProperty("ids")) {
          var temp = [];

          for (var id in argsList.ids) {
            temp = temp.concat(
              json.filter((obj) => {
                return obj.senderID === argsList.ids[id];
              })
            );
          }

          json = temp;
        }

        //filter if message
        if (argsList.hasOwnProperty("message") && argsList.message === true) {
          json = json.filter((obj) => {
            return obj.type === "message";
          });
        }

        //filter if message_reply
        if (argsList.hasOwnProperty("message_reply") && argsList.message_reply === true) {
          json = json.filter((obj) => {
            return obj.type === "message_reply";
          });
        }

        //filter by how long ago message was sent
        if (argsList.hasOwnProperty("minutes")) {
          let minutesAgo = event.timestamp - argsList.minutes * 60 * 1000;

          json = json.filter((obj) => {
            return obj.timestamp > minutesAgo;
          });
        }

        //filter by attachment type
        if (argsList.hasOwnProperty("attachment")) {
          json = json.filter((obj) => {
              if (obj.attachments.length > 0) {
                return obj.attachments[0].type === argsList.attachment
              } else {
                return false
              }
          });
        }

        //find by exact timestamp
        if (argsList.hasOwnProperty("timestamp")) {
          json = json.filter((obj) => {
            return obj.timestamp === argsList.timestamp.toString();
          });
        }

        if (json.length === 1) {
          this.getMessage(event, api, json[0]);
        } else if (json.length === 0) {
          this.message.body = "no messages with that filter were found";
          super.send(event, api, this.message.body);
        } else if (json.length > 1) {
          this.sendTable(event, api, json);
        }

      } catch(err) {
        console.error(err);
      }
    }
  }

  getMessage(event, api, message) {
    var attachments = "";

    for (var image in message.attachments) {
      attachments +=
        message.attachments[image].type +
        " " +
        (parseInt(image) + 1) +
        ": \n" +
        message.attachments[image].url +
        "\n\n";
    }

    super.getName(api, message.senderID, (name) => {
      this.message.body =
        `@${name} said at ${super.formatDateTime(
          message.timestamp,
          -5
        )}: \n\n` +
        message.body +
        "\n\n" +
        attachments;

      this.message.mentions = [
        {
          tag: "@" + name,
          id: message.senderID,
        },
      ];

      api.sendMessage(
        this.message,
        event.threadID,
        (err) => {
          if (err) return console.error(err);
        },
        message.messageID
      );
    });
  }

  async sendTable(event, api, messages) {
    let table = "";
    let attach_type = '';
    let user;

    const getUserInfoPromise = util.promisify(api.getUserInfo)  

    for (var mes in messages) {

      if (messages[mes].attachments[0] === undefined) {
        attach_type = "none"
      } else {
        attach_type = messages[mes].attachments[0].type
      }

      try {
        user = await getUserInfoPromise(messages[mes].senderID)
      } catch (err) {}

      table += `          
      <tr>
      <th>${messages[mes].timestamp}</th>
      <th>${user[messages[mes].senderID].name}</th>
      <th>${messages[mes].body.substring(0, 30)}</th>
      <th>${messages[mes].type}</th>
      <th>${attach_type}</th>
      </tr>`;
    }

    nodeHtmlToImage({
      output: appRoot + "/media/image.png",
      html:
        `<html>
    
      <head>
          <style type="text/css">
              table,
              th,
              td {
                  border: 1px solid black;
                  border-collapse: collapse;
              }
          </style>
      </head>
      
      <body>
          <table style="width:100%">
              <tr>
                  <th>Timestamp</th>
                  <th>Name</th>
                  <th>Body Preview</th>
                  <th>Type</th>
                  <th>Attachment</th>
              </tr>` +
        table +
        `
          </table>
      </body>
      
      </html>`,
    }).then(() => {
      console.log("The image was created successfully!");
      this.message.body = "";
      this.message.attachment = fs.createReadStream(
        appRoot + "/media/image.png"
      );
      super.send(event, api, this.message);
    });
  }
};
