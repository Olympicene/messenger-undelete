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
                var scale = Math.round(Math.min(dimensions.height, dimensions.height)/8);
                
                text = self.cleanInput(text.substring(5), 200, 20);
                var padding = Math.round(Math.round(text.length/2)*scale)+Math.round(scale*0.8);
                console.log(padding);
                text = text.join(' ');
    
                let options = {
                    image: 'meme.jpg',         // Required
                    outfile: 'meme-meme.jpg',  // Required
                    topText: text,            // Required
                    font: './impact.ttf',
                    fontSize: scale,
                    textPos: 'Center',
                    padding: padding,
                }
    
                memeMaker(options, function(err) {
                    if(err) return console.error(err);
                    console.log('Image saved: ' + options.outfile);
                    
                    console.log(options.outfile);
    
                    var msg = {
                        attachment: fs.createReadStream(options.outfile),
                    }
    
                    callback_(msg);
                });
            });
        });
    }
}

