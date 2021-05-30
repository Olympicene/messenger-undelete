const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const Args = require(appRoot + "/src/Args.js");
const config = require(appRoot + "/database/config.js");
const nodeHtmlToImage = require('node-html-to-image')
const fs = require("fs");
var path = require("path");

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

  doAction(event, api) {
    var args = new Args(event);

    let check = (list, target) => target.every((v) => list.includes(v));
    let argsList = args.removeMentions();

    if (check(["h"], Object.keys(argsList)) && argsList.h === true) {
      this.message.body = `
      Usage:
        !undelete [-h] : help
        !undelete --id=<message id> : find by message id
        !undelete --attachments=<# of attachments> : find by # of attachments
        !undelete --minutes=<message id> : find by how many minutes ago
        !undelete @<FirstName LastName> : find by senderID
      `;
      super.send(event, api, this.message);
    }

    if (check(["id", "ids", "attachments", "minutes"], Object.keys(argsList))) {
      fs.readFile(databaseDir(event.threadID), (err, data) => {
        if (err) return console.error(err);

        var json = JSON.parse(data);

        //filter my message id
        if(argsList.hasOwnProperty("id")) {
          json = json.filter(obj => {return obj.messageID === argsList.id})
        }

        //filter by sender id
        if(argsList.hasOwnProperty("ids")) {
          var temp = []
          
          for(var id in argsList.ids) {
            temp = temp.concat(json.filter(obj => {return obj.senderID === argsList.ids[id]}))
          }

          json = temp;
        }

        if(argsList.hasOwnProperty("attachments")) {
          json = json.filter(obj => {return obj.attachments.length === argsList.attachments})
        }

        if(argsList.hasOwnProperty("minutes")) {
          let minutesAgo = event.timestamp - argsList.minutes * 60 * 1000

          json = json.filter(obj => {return obj.timestamp > minutesAgo})
        }

        if(json.length === 1) {
          this.getMessage(event, api, json[0])
        } else if(json.length === 0) {
          this.message.body = 'no messages with that filter were found'

          super.send(event, api, this.message.body)
        } else if(json.length > 1) {
          this.sendTable(event, api, json)
        }
      });
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

  sendTable(event, api, messages) {
    let table = ''

    for(var mes in messages) {
      table += `          
      <tr>
      <th>${messages[mes].timestamp}</th>
      <th>${messages[mes].body.substring(0, 30)}</th>
      <th>${messages[mes].senderID}</th>
      <th>${messages[mes].attachments.length}</th>
      <th>${Object.keys(messages[mes].mentions).length}</th>
      </tr>`
    }

    nodeHtmlToImage({
      output: appRoot + '/media/image.png',
      html: `<html>
    
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
                  <th>Body Preview</th>
                  <th>Sender ID</th>
                  <th>attachments</th>
                  <th>mentions</th>
              </tr>` + table + `
          </table>
      </body>
      
      </html>`
    })
    .then(() => {
      console.log('The image was created successfully!')
      this.message.body = "";
      this.message.attachment = fs.createReadStream(appRoot + "/media/image.png");
      super.send(event, api, this.message)
    })
  }
};
