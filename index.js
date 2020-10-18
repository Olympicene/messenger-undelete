const fs = require("fs");
var path = require('path');
const login = require("facebook-chat-api");
const request = require('request');

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions(
        {
        listenEvents: true,
        selfListen: true
    })

    var timeout = 30000; // 1000 for one second
    var inTimeout = {};

    function removeEmojis(string) {
        var regex = /[^a-z0-9_]/gi;
        var clean = string.replace(regex, '')
        if(clean == '') {
            clean = 'only alphanumeric characters because fuck you';
        }
        return clean;
    }

    var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        var id = event.threadID;
        if(event.type == "message_reply" && !inTimeout[id] && event.threadID == 2401681243197992) {
            switch(event.body) {
                case "!soyjack":
                    var filter = removeEmojis(event.messageReply.body.split(' ').join('_'));
                    console.log(filter);
                    download("https://memegen.link/custom/" + filter + ".jpg?alt=https://i.kym-cdn.com/photos/images/facebook/001/330/809/d90.png", 'soyjack.png', function(){
                        console.log('done');
                        var msg = {
                            //url: "https://memegen.link/custom/" + event.messageReply.body.replace('/[^\w\s]/gi', '').split(' ').join('_') + ".jpg?alt=https://i.kym-cdn.com/photos/images/facebook/001/330/809/d90.png"
                            attachment: fs.createReadStream('soyjack.png')
                        }
                        api.sendMessage(msg, event.threadID);
                        if(timeout){
                            inTimeout[id] = true;
                            setTimeout(function(){
                                inTimeout[id] = false;
                            }, timeout);
                        }
                      });
                default:
            }
        } else if(inTimeout[id]){
            console.log("multiple attempts")
        }
    });
});