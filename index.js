const fs = require("fs");
const path = require("path");
const config = require("./database/config.js");
const login = require("facebook-chat-api");
const Listener = require("./src/EventListener.js");

require("dotenv").config();

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

    ////////////////////////////////////////////////////SendHelper////////////////////////////////////////////////////
    function send(contents, threadID, replyID) {
      new Promise((resolve, reject) => {
        api.sendMessage(contents, threadID, (err) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(`message sent`);
          }, replyID);
      });
    }

    ////////////////////////////////////////////////////ErrorHelper////////////////////////////////////////////////////
    function error(errorMessage, threadID, replyID) {
      contents = {};
      contents.body = errorMessage;
      console.log(errorMessage);
    
      new Promise((resolve) => {
        api.sendMessage(contents, threadID, (err) => {
          if (err) return console.error(err);
    
          resolve();
        }, replyID);
      });
    }

    ////////////////////////////////////////////////////ListenLoop////////////////////////////////////////////////////
    var eventListener = new Listener();

    api.listenMqtt((err, event) => {
      if (err) return console.error(err);

      //DEBUG
      if (config.DEBUG) {
        console.log(event);
      }

      //commands
      eventListener.receive(event, send, error);
    });
  }
);
