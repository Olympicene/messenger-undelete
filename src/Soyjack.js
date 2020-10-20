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

    cleanInput(text) {
        const regex = /[^a-z0-9 _.,!"'/$]/gi;

        text = text.toUpperCase();
        text = text.replace(regex, '');
        if(text == '')
            text = 'PLEASE ONLY USE ALPHANUMERIC CHARACTERS';
        text = this.truncate(text, 400);
        text = this.chunk(text, 30);
        return text;
    }

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    };

    chunk(str, n) {
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
        return ret;
    }

    
    getSoyJack(text) {
        const outfile = 'soyjack-meme.jpg'
        text = this.cleanInput(text);
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
        });

        return outfile;
    }
}

