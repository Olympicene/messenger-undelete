const Command = require('./Command.js');
const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');

module.exports = class TheUrge extends Command {
    constructor(ids) {
        super(ids);
        this.term = '!TheUrge';
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
        
        var url = 'https://i.ibb.co/QdZ8BDb/165670278-1353254831738443-1968237180024515079-n.jpg';
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