const fs = require("fs");
const path = require("path");
const config = require("./database/config");
const glob = require("glob");
const login = require("facebook-chat-api");
const Timeout = require("./src/Timeout");


////////////////////////////////////////////////////ImportCommands////////////////////////////////////////////////////
var commandList = [];
var ignoredList = config.ignored_commands;

glob.sync("./src/*.js").forEach((file) => {
  if (
    !ignoredList.map((command) => "./src/" + command + ".js").includes(file)
  ) {
    commandList.push(require(file));
  }
});

//print out all active commands
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
    
    api.setOptions(config.apiOptions);

    ////////////////////////////////////////////////////ChangeVars////////////////////////////////////////////////////

    //init timeout timer
    const use = new Timeout(config.timeout_milliseconds); //30000 used to be

    // add the threadID of chats you want enabled
    threadIDs = config.allowed_threads

    ////////////////////////////////////////////////////ListenLoop////////////////////////////////////////////////////
    api.listenMqtt((err, event) => {
      if(err) return console.error(err);

      
      //DEBUG
      if(config.DEBUG) {console.log(event)}

      //commands
      if (!use.inTimeout(event.threadID)) {
        for (var command in commandList) {
          new commandList[command](threadIDs).listen(event, api, use);
        }

      }
    });
  }
);
