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
    this.type = ["message_reply"];
    this.message = {};
  }

  async doAction(event, api) {
    var url = event.messageReply.attachments[0].url;
    const imageLocation = appRoot + `/media/anime.png`;
    const videoLocation = appRoot + `/media/anime.mp4`;

    await super.downloadFile(url, imageLocation);

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imageLocation));

    ////////////////////////////////////////////////////TRACE.MOE////////////////////////////////////////////////////

    const search = await fetch("https://api.trace.moe/search?anilistInfo", {
      method: "POST",
      body: formData,
    }).then((e) => e.json());

    this.message.body =
      `${search.result[0].anilist.title.native}\n` +
      `${search.result[0].anilist.title.english}\n` +
      `episode: ${search.result[0].episode}\n` +
      `time: ${super.secondsToHms(search.result[0].from)}\n` +
      `similarity: ${Math.round(search.result[0].similarity * 100)}%\n`;

    //console.log(this.message.body);

    await super.downloadFile(search.result[0].video, videoLocation);

    this.message.attachment = fs.createReadStream(videoLocation);

    super.send(event, api, this.message);
  }
};
