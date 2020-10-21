const fs = require("fs");
const Command = require('./Command.js');
const memeMaker = require('meme-maker');
const request = require('request');
let gm = require('gm')


module.exports = class Meme extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!meme';
        this.type = 'message_reply';
        this.message = {
            attachment: '',
        }
    }

    download(uri, filename, callback){
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };
        
    getMeme(text, url, callback_) {
        this.download(url, 'meme.jpg', () => {
            var self = this;
            let img = gm('meme.jpg');

            img.size(function(err, dimensions) {
                var scale = Math.round(Math.min(dimensions.width, dimensions.height)/9);                

                var topText = text.split(/_(.+)/)[0];
                var botText = text.split(/_(.+)/)[1];

                if(botText == undefined)
                    var botText = '';

                if(topText == undefined)
                    var topText = '';

                console.log(botText);

                topText = self.cleanInput(topText.substring(5), 200, Math.round((dimensions.width/(scale/2))*1.1));

                var padding = Math.round(Math.round(topText.length/2)*scale)+Math.round(scale*1.6);
                topText = topText.join(' ');

                botText = self.cleanInput(botText, 200, Math.round((dimensions.width/(scale/2))*1.1));
                botText = botText.join(' ');

                let options = {
                    image: 'meme.jpg',         // Required
                    outfile: 'meme-meme.jpg',  // Required
                    topText: topText,
                    bottomText: botText,           // Required
                    font: './impact.ttf',
                    fontSize: scale,
                    textPos: 'Center',
                    padding: padding,
                    strokeWeight: Math.round(Math.round(scale/15)),
                }
    
                memeMaker(options, function(err) {
                    if(err) return console.error(err);
                    console.log('Image saved: ' + options.outfile);

                    var msg = {
                        attachment: fs.createReadStream(options.outfile),
                    }
    
                    callback_(msg);
                });
            });
        });
    }
}

