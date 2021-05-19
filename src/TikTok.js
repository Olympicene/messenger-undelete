const Command = require("./Command.js");
var path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

module.exports = class TikTok extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!TikTok";
    this.description = "[hashtag]";
    this.type = ["message", "message_reply"];
    this.needContent = true;
    this.message = {
      body: "",
    };
  }

  async doAction(event, api) {
    const mediaDir = path.resolve(__dirname + "/../media/"); //directory the shibe file is going to

    await this.doCommand(
      `tiktok-scraper hashtag ${super.getContent(event)[0]} -n 1 --filepath ${mediaDir} -t json -f tiktokdata`
    );

    ////////////////////////////////////////////TRY_TO_GET////////////////////////////////////////////

    try {
      const tiktokdata = JSON.parse(
        fs.readFileSync(mediaDir + "/tiktokdata.json", "utf8")
      );

      await this.doCommand(
        `tiktok-scraper video ${tiktokdata[0].webVideoUrl} -d tiktok --filepath ${mediaDir}`
      );

      this.message.attachment = fs.createReadStream(
        mediaDir + `/${tiktokdata[0].id}.mp4`
      );

      super.send(event, api, this.message).then(() => {
        try {
          fs.unlinkSync(mediaDir + `/${tiktokdata[0].id}.mp4`);
          fs.unlinkSync(mediaDir + `/tiktokdata.json`);
  
          console.log("Files are deleted.");
        } catch (error) {
        }
      });

    } catch (err) {
      this.message.body = "This tiktok hashtag does not exist."
      super.send(event, api, this.message);
    }

    ////////////////////////////////////////////SEND_STUFF////////////////////////////////////////////

  }

  async doCommand(cmd) {
    await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject();
        } else {
          console.error(`${stderr}`);
          resolve();
        }
      });
    });
  }
};
