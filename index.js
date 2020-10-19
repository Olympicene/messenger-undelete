const fs = require("fs");
const path = require('path');
const login = require("facebook-chat-api");
const request = require('request');
const timeout = require('./src/timeout.js');
const memeMaker = require('meme-maker')

//dont forget you need  graphicsmagick


login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({
        listenEvents: true,
        selfListen: true
    })

    function removeEmojis(string) {
        var regex = /[^a-z0-9 ]/gi;
        var clean = string.replace(regex, '')
        if(clean == '') {
            clean = 'only alphanumeric characters because fuck you';
        }
        return clean;
    }

    function chunk(str, n) {
        var ret = [];
        var i;
        var len;
        for(i = 0, len = str.length; i < len; i += n) {
           ret.push(str.substr(i, n));
        }
    
        return ret
    };
    

    //start of important stuff
    api.listenMqtt((err, event) => {
        if(err) return console.error(err);
        if(event.type == "message_reply" && !timeout.inTimeout(event.threadID)) {
            switch(event.body) {
                case "!soyjack":
                    var filter = chunk(removeEmojis(event.messageReply.body.toUpperCase()),13);
                    var padding = (Math.round(filter.length/2)*100)+40;
                    var filter = filter.join('\n');

                    let options = {
                        image: 'soyjack.jpg',         // Required
                        outfile: 'soyjack-meme.jpg',  // Required
                        topText: filter,            // Required
                        font: './impact.ttf',
                        fontSize: 100,
                        textPos: 'Center',
                        padding: padding,
                    }    
                    memeMaker(options, function(err) {
                        if(err) return console.error(err);
                        console.log('Image saved: ' + options.outfile);

                        var msg = {
                            attachment: fs.createReadStream('soyjack-meme.jpg')
                        }
                        api.sendMessage(msg, event.threadID);
                        timeout.threadTimeout(event.threadID);
                    });
                default:
            }
        }
    });
});