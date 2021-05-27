const Command = require("./Command.js");
const fetch = require("node-fetch");
const fs = require("fs");
const request = require("request");
const imageToBase64 = require("image-to-base64");
const appRoot = require('app-root-path');
const { env } = require("process");

module.exports = class Anime extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Anime";
    this.description = "(must be a reply to media)";
    this.type = ["message_reply"];
    this.needContent = false;
  }

  doAction(event, api) {
    //abstract

    if (event.messageReply != []) {
      var url = event.messageReply.attachments[0].url;

      const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
          request(url).pipe(fs.createWriteStream(path)).on("close", callback);
        });
      };

      const path = appRoot + "/media/anime.png";

      download(url, path, () => {
        console.log("✅ Done!");

        imageToBase64(path) // Path to the image
          .then((response) => {
            //console.log(response); // "cGF0aC90by9maWxlLmpwZw=="

            fetch("https://trace.moe/api/search", {
              body: "image=$(" + response + ")",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              method: "POST",
            })
              .then((res) => res.json())
              .then((result) => {
                //console.log(result.docs[0]);

                this.message.body =
                  result.docs[0].title_native +
                  "\n" +
                  result.docs[0].title_english +
                  "\n" +
                  "episode: " +
                  result.docs[0].episode +
                  "\n" +
                  "time: " +
                  super.secondsToHms(result.docs[0].at) +
                  "\n" +
                  "confidence: " +
                  result.docs[0].similarity * 100 +
                  "%";

                super.send(event, api, this.message);
              });
          })
          .catch((error) => {
            console.log(error); // Logs an error if there was one
          });
      });
    }
  }
};
