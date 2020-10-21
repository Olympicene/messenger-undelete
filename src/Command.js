module.exports = class Commands {

    constructor(ids) {
        this.term = '!command';
        this.type = 'message_reply';
        this.threadIDs = ids;
        this.message = {
            body: '',
            sticker: '',
            attachment: '',
            url: '',
            emoji: '',
        }
    }

    cleanInput(text, max) {
        const regex = /[^a-z0-9 _.,!"'/$]/gi;

        text = text.toUpperCase();
        text = text.replace(regex, '');
        if(text == '')
            text = 'PLEASE ONLY USE ALPHANUMERIC CHARACTERS';
        text = this.truncate(text, max);
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
}