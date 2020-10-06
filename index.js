const fs = require("fs");
var path = require('path');
const login = require("facebook-chat-api");

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({listenEvents: true})

    var timeout = 300000; // 1000 for one second
    var inTimeout = {};

    api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        var id = event.threadID;
        console.log(event)
        if(event.type == "message_reply" && !inTimeout[id]) {
            switch(event.body) {
                case "!soyjack":
                    var msg = {
                        url: "https://memegen.link/custom/" + event.messageReply.body.replace('/[^\w\s]/gi', '').split(' ').join('_') + ".jpg?alt=https://i.kym-cdn.com/photos/images/facebook/001/330/809/d90.png"
                    }
                    api.sendMessage(msg, event.threadID);
                    if(timeout){
                        inTimeout[id] = true;
                        setTimeout(function(){
                            inTimeout[id] = false;
                        }, timeout);
                    }
                default:
            }
        } else if(inTimeout[id]){
            console.log("multiple attempts")
        }
    });
});