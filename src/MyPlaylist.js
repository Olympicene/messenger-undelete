const Command = require("./Command.js");
const SpotifyWebApi = require('spotify-web-api-node');
var path = require("path");
const fs = require("fs");



module.exports = class MyPlaylist extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!MyPlaylist";
    this.description = " ";
    this.type = ["message", "message_reply"];
    this.needContent = false;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");
    var playlist = JSON.parse(fs.readFileSync(databaseDir + "/playlists.json"));

    playlist[event.senderID] = "this is some text"
    
    fs.writeFileSync(databaseDir + "/playlists.json", JSON.stringify(playlist, null, "\t"));
  }
};
