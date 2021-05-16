const fs = require("fs");
const path = require("path");
const glob = require("glob");
const login = require("facebook-chat-api");
const Timeout = require("./src/Timeout");

////////////////////////////////////////////////////ImportCommands////////////////////////////////////////////////////
var commandList = [];
var ignoredList = [
  "Command",
  "Timeout",
  "Undelete",
  "ExampleCommand",
  "Shutdown",
  "Meme",
];

glob.sync("./src/*.js").forEach((file) => {
  if (
    !ignoredList.map((command) => "./src/" + command + ".js").includes(file)
  ) {
    commandList.push(require(file));
  }
});

console.log(commandList);

////////////////////////////////////////////////////LoginWithCookies////////////////////////////////////////////////////
const databaseDir = path.resolve(__dirname + "/database/");

login(
  { appState: JSON.parse(fs.readFileSync("database/appstate.json", "utf8")) },
  (err, api) => {
    if (err) return console.error(err);

    fs.writeFileSync(
      databaseDir + "/appstate.json",
      JSON.stringify(api.getAppState())
    ); //store cookies

    ////////////////////////////////////////////////////Setoptions////////////////////////////////////////////////////
    api.setOptions({
      listenEvents: true,
      selfListen: true,
      forceLogin: true,
    });

    ////////////////////////////////////////////////////ChangeVars////////////////////////////////////////////////////

    //start timeout timer
    const use = new Timeout(10000); //30000 used to be

    // add the threadID of chats you want enabled
    threadIDs = [
      "2401681243197992",
      "4432056806822983",
      "4341136652627262",
      "4258360417509656",
    ];

    ////////////////////////////////////////////////////ListenLoop////////////////////////////////////////////////////
    api.listenMqtt((err, event) => {
      //DEBUG
      if(err) return console.error(err);
      console.log(event);

      if (!use.inTimeout(event.threadID)) {
        for (var command in commandList) {
          new commandList[command](threadIDs).listen(event, api, use);
        }

      }
    });
  }
);
