const fs = require("fs");
const path = require('path');
const login = require("facebook-chat-api");
const request = require('request');
const timeout = require('./src/timeout.js');
const memeMaker = require('meme-maker');

//dont forget you need  graphicsmagick

login({appState: JSON.parse(fs.readFileSync('database/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({
        listenEvents: true,
        selfListen: true
    })

    function removeEmojis(string) {
        var regex = /[^a-z0-9 _.,!"'/$]/gi;
        var clean = string.replace(regex, '')
        if(clean == '') {
            clean = 'only alphanumeric characters because fuck you';
        }
        return clean;
    }

    function truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    };

    function chunk(str, n) {
        var temp = str.split(' ');
        var ret = [];
        var sum = 0;
        var hold = '';
    
        for(var i = 0;  i < temp.length; i++) {
          sum += temp[i].length+1;
          if(sum < n) {
            hold += (temp[i] + ' ');
          } else {
            hold += '\n';
            ret.push(hold);
            hold = '';
            hold += temp[i] + ' ';
            sum = temp[i].length+1;
          }
        }
        ret.push(hold);
        console.log(ret);
        return ret;
    }
    
    
        // api.getThreadList(5, null, [], (err, list) => {
        //     console.log(list[0].participants);
        // });

        // if(event.senderID == 100028187042429 && event.threadID == 2401681243197992) {
        //     api.setMessageReaction("👎", event.messageID);
        // }


    //start of important stuff
    api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        if(event.type == "message_reply" && !timeout.inTimeout(event.threadID)) {
            switch(event.body) {
                case "!soyjack": //command term
                    var filter = chunk(truncate(removeEmojis(event.messageReply.body.toUpperCase()),400),30); //do this in command
                    var padding = (Math.round(filter.length/2)*50)+40;
                    var filter = filter.join(' ');

                    let options = {
                        image: 'soyjack.jpg',         // Required
                        outfile: 'soyjack-meme.jpg',  // Required
                        topText: filter,            // Required
                        font: './impact.ttf',
                        fontSize: 50,
                        textPos: 'Center',
                        padding: padding,
                    }    
                    memeMaker(options, function(err) {
                        if(err) return console.error(err);
                        console.log('Image saved: ' + options.outfile);

                        var msg = {
                            attachment: fs.createReadStream('soyjack-meme.jpg') // part of command
                        }
                        api.sendMessage(msg, event.threadID);
                        timeout.threadTimeout(event.threadID);
                    });
                default:
            }
        }
    });
});