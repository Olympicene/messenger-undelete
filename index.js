const fs = require("fs");
const path = require('path');
const login = require("facebook-chat-api");
const runes = require('runes');
const Timeout = require('./src/Timeout.js');
const Emoji = require('./src/Emoji.js');
const Theme = require('./src/Theme_list.js');

// TODO
// Change Emoji Capability //
// Change Theme Capability 
// List Possible Themes
// Create Poll
// Screenshot generator (HTML to screenshot)
// Undelete
// emoji size?
// admin privs?

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({
        listenEvents: true,
        selfListen: true,
        forceLogin: true,
    })


    //start timeout timer
    const use = new Timeout(30000);

    //initialize commands
    var emj = new Emoji("4341136652627262");
    var the = new Theme("4341136652627262");


    //listen loop
    api.listenMqtt((err, event) => {

        // DEBUG
        // if(err) return console.error(err);
        // console.log(event);

        if(!use.inTimeout(event.threadID)) {

            emj.getEmoji(event, api, use);
            the.getTheme(event, api, use);
        
        }
    });
});