const Command = require('./Command.js');
const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');

module.exports = class Chad extends Command {
    constructor(ids) {
        super(ids);
        this.term = '!Chad';
        this.type = 'message_reply';
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        const download = (url, path, callback) => {
            request.head(url, (err, res, body) => {
              request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
            })
        }

        var text = super.cleanInput(event.messageReply.body).split(' ').join('_').replace(/\/{2,}/g, "/"); //clean split spaces into _ remove all other /
        
        var url = 'https://api.memegen.link/images/custom/_' + text + '.png?background=https://i.kym-cdn.com/entries/icons/facebook/000/026/152/gigachad.jpg';

        const path = './src/image.png'

        download(url, path, () => {
            console.log('✅ Done!')

            this.message.attachment = fs.createReadStream(__dirname + '/image.png');

            api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                if(err) return console.error(err);
            });
        });

        // api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
        //     if(err) return console.error(err);
        // });
    }  
}