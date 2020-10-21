const fs = require("fs");
const Command = require('./Command.js');
const memeMaker = require('meme-maker');

module.exports = class Soyjack extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!soyjack';
        this.type = 'message_reply';
        this.message = {
            attachment: '',
        }
    }
        
    getSoyJack(text, callback_) {
        const outfile = 'soyjack-meme.jpg'
        text = this.cleanInput(text, 400, 30);
        var padding = (Math.round(text.length/2)*50)+40;
        text = text.join(' ');

        let options = {
            image: 'soyjack.jpg',         // Required
            outfile: outfile,  // Required
            topText: text,            // Required
            font: './impact.ttf',
            fontSize: 50,
            textPos: 'Center',
            padding: padding,
        }    
        memeMaker(options, function(err) {
            if(err) return console.error(err);
            console.log('Image saved: ' + options.outfile);

            var msg = {
                attachment: fs.createReadStream(options.outfile),
            }

            callback_(msg);
        });
    }
}

