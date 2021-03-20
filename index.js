const fs = require("fs");
const login = require("facebook-chat-api");
const Timeout = require('./src/Timeout.js');
const ChangeEmoji = require('./src/ChangeEmoji.js');
const ThemeList = require('./src/ThemeList.js');
const ChangeTheme = require('./src/ChangeTheme.js');
const RemindMe = require("./src/RemindMe.js");

// Objective: do things that a normal messenger user can't too hard to do
// TODO
// Change Emoji Capability //can add emojis not normally able ot get
// Change Theme Capability //able to get unknown themes?
// List Possible Themes    //functionality
// RemindMe
// ListCommands             
// mass add remove users?  

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

    //initialize commands add the threadID of chats you want enabled
    var emj = new ChangeEmoji("4341136652627262");
    var cth = new ThemeList("4341136652627262");
    var the = new ChangeTheme("4341136652627262");
    var rem = new RemindMe("4341136652627262");


    //listen loop
    api.listenMqtt((err, event) => {

        //DEBUG
        if(err) return console.error(err);
        console.log(event);

        if(!use.inTimeout(event.threadID)) {

            cth.listen(event, api, use);
            emj.listen(event, api, use);
            the.listen(event, api, use);
            rem.listen(event, api, use);
        }
    });
});