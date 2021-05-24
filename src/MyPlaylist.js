const Command = require("./Command.js");
var path = require("path");
const fs = require("fs");
var url = require("url");




module.exports = class MyPlaylist extends Command {
  constructor(ids) {
    super(ids);
    this.term = "!MyPlaylist";
    this.description = "[spotify playlist link]";
    this.type = ["message", "message_reply"];
    this.needContent = true;
    this.message = {
      body: "",
    };
  }

  doAction(event, api) {
    const databaseDir = path.resolve(__dirname + "/../database/");
    var playlist = JSON.parse(fs.readFileSync(databaseDir + "/playlists.json"));

    console.log(super.getContent(event)[0])

    try {
      var playlistID = url.parse(super.getContent(event)[0]).pathname;
      playlistID = playlistID.substr(playlistID.length - 22);

      if(super.cleanInput(playlistID).length == 22) {
        playlist[event.senderID] = playlistID;
        fs.writeFileSync(databaseDir + "/playlists.json", JSON.stringify(playlist, null, "\t"));
        this.message = "Successfully saved your playlist."
      } else {
        throw "not a valid id"
      }      
    } catch (err) {
      console.error(err);

      this.message = "There was an error saving your playlist. "
    }

    super.send(event, api, this.message)
  }
};
