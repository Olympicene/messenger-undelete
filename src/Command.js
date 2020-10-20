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
}