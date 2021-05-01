const Command = require('./Command.js');
const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');

module.exports = class Shibe extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Shibe';
        this.type = 'message';
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

        fetch("http://shibe.online/api/shibes?")
        .then((res) => res.json())
        .then((result) => {
        
            var url = result[0];
            const path = './src/image.png'

            download(url, path, () => {
                console.log('✅ Done!')
    
                this.message.attachment = fs.createReadStream(__dirname + '/image.png');
    
                api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                    if(err) return console.error(err);
                });
            });



        });
    }  
}