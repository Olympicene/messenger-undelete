const Command = require("./Command.js");
const fetch = require("node-fetch");
const request = require("request");
const fs = require("fs");

module.exports = class Meme extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!Meme";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = true;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    // if(event.messageReply != [] && event.messageReply.attachments[0].type == 'photo') {
    //     var text = super.cleanInput(super.getContent(event).join(' ')).split(' ').join('_').replace(/\/{2,}/g, "/"); //clean split spaces into _ remove all other /
    //     var url = 'https://api.memegen.link/images/custom/_' + text + '.png?background=' + event.messageReply.attachments[0].url;
    //     console.log(url)
    //     const path = './src/image.png'
    //     download(url, path, () => {
    //         console.log('✅ Done!')
    //         this.message.attachment = fs.createReadStream(__dirname + '/image.png');
    //         api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
    //             if(err) return console.error(err);
    //         });
    //     });
    // }
    // api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
    //     if(err) return console.error(err);
    // });
  }
};
