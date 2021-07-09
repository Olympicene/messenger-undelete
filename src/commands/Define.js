const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
var axios = require("axios").default;
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");

module.exports = class ExampleCommand extends Command {
  constructor() {
    super();
    this.description = " ";
    this.arguments = { _: 2 };
    this.type = ["message", "message_reply"];
    this.message = {};
  }

  async doAction(message, send, error, typingIndicator) {
    //maybe temp but only way i can get the typing indicator
    var stop = typingIndicator(message.threadID);
    var id = setInterval(() => {
      typingIndicator(message.threadID);
    }, 5000);

    if (
      !(
        message.body._[1][0] == '"' &&
        message.body._[1][message.body._[1].length - 1] == '"'
      )
    ) {
      error(
        "your second argument is not in double quotes",
        message.threadID,
        message.ID
      );
    } else {
      var lookup = message.body._[1].slice(1, message.body._[1].length - 1);

      var options = {
        method: "GET",
        url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
        params: { term: lookup },
        headers: {
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
          "x-rapidapi-host":
            "mashape-community-urban-dictionary.p.rapidapi.com",
        },
      };

      const search = await axios.request(options).catch((err) => {
        error(
          `error trying to connect to urban dictionary: ${err}`,
          message.threadID,
          message.ID
        );
      });

      var dictionary = search.data.list[0];

      if (dictionary != undefined) {
        ////////////////////////////////////////////////////MAKEIMAGE////////////////////////////////////////////////////

        nodeHtmlToImage({
          output: appRoot + "/media/image.png",
          html: `<html>

      <head>
          <link href='https://fonts.googleapis.com/css?family=Lora' rel='stylesheet'>
          <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;1,300&display=swap"
              rel="stylesheet">
          <meta charset="UTF-8">
          <title>title</title>
          <style type="text/css">
              body {
                  font-family: 'Lora';
                  font-size: 22px;
                  padding: 10px;
              }
      
              p {
                  font-family: 'Source Sans Pro', sans-serif;
                  max-width: 95vw;
              }

              h2 {
                color: rgb(19, 79, 230)
              } 
          </style>
      </head>
      
      <body>
          <h2>${dictionary.word}</h2>
          <p>${dictionary.definition
            .replace(/\[/g, '<span style="color: #134FE6"><b>')
            .replace(/\]/g, "</b></span>")}</p>
          <p><i>${dictionary.example
            .replace(/\r?\n/g, "<br>")
            .replace(/\[/g, '<span style="color: #134FE6"><b>')
            .replace(/\]/g, "</b></span>")}</i></p>
      </body>
      
      </html>`,
        }).then(() => {
          console.log("The image was created successfully!");
          this.message.body = "";
          this.message.attachment = fs.createReadStream(
            appRoot + "/media/image.png"
          );
          send(this.message, message.threadID, message.ID);
        });
      } else {
        error('urban dictionary does not have this term', message.threadID, message.ID)
      }
    }

    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }
};
