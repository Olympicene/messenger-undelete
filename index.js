const fs = require("fs");
const login = require("facebook-chat-api");
const Timeout = require('./src/Timeout.js');
const ChangeEmoji = require('./src/ChangeEmoji.js');
const ThemeList = require('./src/ThemeList.js');
const ChangeTheme = require('./src/ChangeTheme.js');
const RemindMe = require("./src/RemindMe.js");
const Undelete = require("./src/Undelete.js");
const Anime = require("./src/Anime.js");
const Shutdown = require("./src/Shutdown.js")
var path = require('path');



const databaseDir = path.resolve(__dirname + '/database/');

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    fs.writeFileSync(databaseDir + '/appstate.json', JSON.stringify(api.getAppState())); //store cookies

    api.setOptions({
        listenEvents: true,
        selfListen: true,
        forceLogin: true,
    })

    //start timeout timer
    const use = new Timeout(30000); //30000

    threadIDs = ['2401681243197992', '4432056806822983']

    //initialize commands add the threadID of chats you want enabled
    und = new Undelete(threadIDs);

    //listen loop
    api.listenMqtt((err, event) => {

        //DEBUG
        // if(err) return console.error(err);
        // console.log(event);

        und.storeHistory(event, api, use);

        if(!use.inTimeout(event.threadID)) {

            new Shutdown(threadIDs).listen(event, api, use);
            new Anime(threadIDs).listen(event, api, use);
            new ThemeList(threadIDs).listen(event, api, use);
            new ChangeEmoji(threadIDs).listen(event, api, use);
            new ChangeTheme(threadIDs).listen(event, api, use);
            new RemindMe(threadIDs).listen(event, api, use);
            und.listen(event, api, use);
        }
    });
});