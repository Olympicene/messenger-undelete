const fs = require("fs");
const path = require('path');
const login = require("facebook-chat-api");
const Timeout = require('./src/Timeout.js');
const Soyjack = require('./src/Soyjack.js');
const Meme = require('./src/Meme.js');
const runes = require('runes');
const { Console } = require("console");


//dont forget you need  graphicsmagick

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({
        listenEvents: true,
        selfListen: true,
        forceLogin: true,
    })

    const soy = new Soyjack([
        '2401681243197992',
    ]);

    const mem = new Meme([
        '2401681243197992',
    ]);

    const use = new Timeout(30000);

    const admin = new Timeout(300000);

    // api.getThreadList(5, null, [], (err, list) => {
    //     console.log(list);
    // });

    var isAdmin = [''];
    
        // api.getThreadList(5, null, [], (err, list) => {
        //     console.log(list[0].participants);
        // });

        // if(event.senderID == 100028187042429 && event.threadID == 2401681243197992) {
        //     api.setMessageReaction("👎", event.messageID);
        // }

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

                    if(event.body.substring(0,5) == '!nick' && event.body.length > 6) {
                        api.changeNickname(event.body.substring(5), event.threadID, event.senderID, (err) => {
                            if(err) return console.error(err);
                        });
                        use.threadTimeout(event.threadID);
                        break;
                    }
                }
            }


            // if(event.type == "message_reply" && soy.threadIDs.includes(event.threadID) && event.body == soy.term && event.messageReply.attachments[0] === undefined) {
            //     soy.getSoyJack(event.messageReply.body, (msg) => {
            //         api.sendMessage(msg, event.threadID);
            //         use.threadTimeout(event.threadID);
            //     });
            // }
            // if(event.type == "message_reply" && !(event.messageReply.attachments[0] === undefined)) {
            //     if(event.messageReply.attachments[0].type == 'photo' && event.body.substring(0,5) == '!meme') {
            //         mem.getMeme(event.body, event.messageReply.attachments[0].url, (msg) => {
            //             api.sendMessage(msg, event.threadID);
            //             use.threadTimeout(event.threadID);
            //         });
            //     }
            // }
            // if(event.type == "message" && isAdmin.includes(event.senderID)) {
            //     if(event.body == "!pause") {
            //         admin.threadTimeout(event.threadID);
            //         console.log("admin said stop");
            //     }
            // }
        }
    });
});