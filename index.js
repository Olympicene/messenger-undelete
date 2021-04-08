const fs = require("fs");
const login = require("facebook-chat-api");
const Timeout = require('./src/Timeout.js');
const ChangeEmoji = require('./src/ChangeEmoji.js');
const ThemeList = require('./src/ThemeList.js');
const ChangeTheme = require('./src/ChangeTheme.js');
const RemindMe = require("./src/RemindMe.js");
const Undelete = require("./src/Undelete.js");

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
    const use = new Timeout(1000); //30000

    threadIDs = ['4341136652627262']

    //initialize commands add the threadID of chats you want enabled
    und = new Undelete(threadIDs);

    //listen loop
    api.listenMqtt((err, event) => {

        //DEBUG
        // if(err) return console.error(err);
        // console.log(event);

        und.storeHistory(event, api, use);

        if(!use.inTimeout(event.threadID)) {

            new ThemeList(threadIDs).listen(event, api, use);
            new ChangeEmoji(threadIDs).listen(event, api, use);
            new ChangeTheme(threadIDs).listen(event, api, use);
            new RemindMe(threadIDs).listen(event, api, use);
            und.listen(event, api, use);
        }
    });
});