const fs = require("fs");
const path = require('path');
const login = require("facebook-chat-api");
const request = require('request');
const timeout = require('./src/timeout.js');
const Soyjack = require('./src/Soyjack.js');

//dont forget you need  graphicsmagick

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({
        listenEvents: true,
        selfListen: true
    })

    const soy = new Soyjack([
        '4341136652627262',
    ]);
    
    
        // api.getThreadList(5, null, [], (err, list) => {
        //     console.log(list[0].participants);
        // });

        // if(event.senderID == 100028187042429 && event.threadID == 2401681243197992) {
        //     api.setMessageReaction("👎", event.messageID);
        // }


    //start of important stuff
    api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        if(event.type == "message_reply" && !timeout.inTimeout(event.threadID) && soy.threadIDs.includes(event.threadID)) {
            switch(event.body) {
                case "!soyjack":
                        soy.getSoyJack(event.messageReply.body);
                        api.sendMessage(soy.message, event.threadID);
                        timeout.threadTimeout(event.threadID);
                default:
            }
        }
    });
});