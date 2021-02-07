const fs = require("fs");
const path = require('path');
const login = require("facebook-chat-api");
const runes = require('runes');
const { Console } = require("console");


login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({
        listenEvents: true,
        selfListen: true,
        forceLogin: true,
    })

    //start of important stuff
    api.listenMqtt((err, event) => {

        if(err) return console.error(err);

        if(!use.inTimeout(event.threadID) && !admin.inTimeout(event.threadID)) {
            if(event.type == "message") {

                var patt = new RegExp("(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])");

                for (let item of runes(event.body)) {
                    if(event.body.substring(0,6) == '!emoji' && patt.test(item)) {
                        api.changeThreadEmoji(item, event.threadID, (err) => {
                            if(err) return console.error(err);
                        });
                        use.threadTimeout(event.threadID);
                        break;
                    }

                    if(event.body.substring(0,5) == '!poll') {
                        api.createPoll("Example Poll", event.threadID, {
                            "Option 1": false,
                            "Option 2": true
                        }, (err) => {
                            if(err) return console.error(err);
                        });
                        use.threadTimeout(event.threadID);
                        break;
                    }
                }
            }
        }
    });
});