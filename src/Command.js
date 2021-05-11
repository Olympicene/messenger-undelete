const { Console } = require("console");
const fetch = require('node-fetch');
var path = require('path');
const fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');




module.exports = class Commands {
    constructor(ids) {
        this.term = '!command';
        this.type = ['message', 'message_reply'];
        this.needContent = false;
        this.message = {
            body: '',
            mentions: '',
        }
        this.threadIDs = ids;
    }

    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay;
    }

    listen(event, api, use) {
        if(this.checkEvent(event)) {
            if(this.needContent == this.isContent(event)) {
                try {
                    this.doAction(event, api);
                    use.threadTimeout(event.threadID);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    async send(event, api, message) {
        await new Promise((resolve) => {
            api.sendMessage(message, event.threadID, (err) => { //send thread stuff
            if(err) return console.error(err);
            
            resolve();
            });
        });
    }

    doAction(event, api) { //abstract
        throw "Abstract method not implemented";
    };

    checkEvent(event) { //check if message type and term is valid
        if((this.type.indexOf(event.type) > -1) && this.threadIDs.includes(event.threadID)) {
            if(event.body.split(' ')[0].toUpperCase() == this.term.toUpperCase()) {
                return true; 
            }
        }
        return false;
    }

    getContent(event) { //gets added content of command
        return(event.body.split(" ").slice(1));
    }

    isContent(event){ //checks if there is no added content
        return !(event.body.split(" ").length == 1); 
    }

    cleanInput(text) { //cleans input of emojis etc
        const regex = /[^a-z0-9 _.,!"'/$]/gi;
        text = text.replace(regex, '');
        return text;
    }

    isNumeric(str) { //https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    async downloadFile(url, path) {
        const res = await fetch(url);
        const fileStream = fs.createWriteStream(path);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
    }

    async combine() {
        const mediaDir = path.resolve(__dirname + '/../media/'); //directory the shibe file is going to

        await new Promise((resolve, reject) => {
            ffmpeg()
                .addInput(mediaDir + '/video.mp4')
                .addInput(mediaDir + '/audio.mp4')
                .outputOptions([
                    '-c copy',
                    '-map 0:v:0',
                    '-map 1:a:0'
                ])
                .output(mediaDir + '/outputfile.mp4')
                .on('end', resolve)
                .on("error", reject)
                .run()
        });   
    }

}

