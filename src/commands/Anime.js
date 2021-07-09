const appRoot = require("app-root-path");
const Command = require(appRoot + "/src/Command.js");
const config = require(appRoot + "/database/config.js");
var FormData = require("form-data");
var fs = require("fs");
const fetch = require("node-fetch");


module.exports = class ExampleCommand extends Command {
  constructor() {
    super();
    this.description = " : reply to an screenshot to get source";
    this.arguments = { _: 1 };
    this.type = ["message_reply_1_attachments"];
    this.message = {};
  }

  async doAction(message, send, error, typingIndicator) {
    //maybe temp but only way i can get the typing indicator
    var stop = typingIndicator(message.threadID);
    var id = setInterval(() => {typingIndicator(message.threadID)}, 5000);

    var url = message.messageReply.attachments[0].url;
    const imageLocation = appRoot + `/media/anime.png`;
    const videoLocation = appRoot + `/media/anime.mp4`;

    await super.downloadFile(url, imageLocation);

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imageLocation));

    ////////////////////////////////////////////////////TRACE.MOE////////////////////////////////////////////////////

    const search = await fetch("https://api.trace.moe/search?anilistInfo", {
      method: "POST",
      body: formData,
    })
      .then((e) => e.json())
      .catch((err) =>
        error(
          `error trying to connect to trace.moe: ${err}`,
          message.threadID,
          message.ID
        )
      );

    this.message.body =
      `${search.result[0].anilist.title.native}\n` +
      `${search.result[0].anilist.title.english}\n` +
      `episode: ${search.result[0].episode}\n` +
      `time: ${super.secondsToHms(search.result[0].from)}\n` +
      `similarity: ${Math.round(search.result[0].similarity * 100)}%\n`;

    await super.downloadFile(search.result[0].video, videoLocation);

    this.message.attachment = fs.createReadStream(videoLocation);

    send(this.message, message.threadID, message.messageReply.messageID);

    //maybe temp but only way i can get the typing indicator
    stop();
    clearInterval(id);
    return;
  }
};
