const fs = require("fs");
const path = require("path");
const config = require("./database/config.js");
const login = require("facebook-chat-api");
const Listener = require("./src/EventListener.js");

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

    ////////////////////////////////////////////////////SetAPIOptions////////////////////////////////////////////////////
    api.setOptions(config.apiOptions);

    ////////////////////////////////////////////////////ListenLoop////////////////////////////////////////////////////
    var eventListener = new Listener(api);

    api.listenMqtt((err, event) => {
      if (err) return console.error(err);

      //DEBUG
      if (config.DEBUG) {
        console.log(event);
      }

      //Delegate events in seperate class
      console.time('doSomething')

      eventListener.receive(event, api);
      
      console.timeEnd('doSomething')

    });
  }
);
