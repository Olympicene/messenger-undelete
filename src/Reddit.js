const Command = require('./Command.js');
const fs = require('fs');
var path = require('path');
const snoowrap = require('snoowrap');


module.exports = class Reddit extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Reddit';
        this.type = ['message', 'message_reply'];
        this.needContent = true;
        this.message = {
            body: '',
        }
    }

    async doAction(event, api) {

        const mediaDir = path.resolve(__dirname + '/../media/'); //directory the shibe file is going to
        const databaseDir = path.resolve(__dirname + '/../database/');
        const credentials = JSON.parse(fs.readFileSync(databaseDir + '/credentials-reddit.json', 'utf8')); //gets credentials
        let file = '';
        let url = '';

        const r = new snoowrap({
            userAgent: credentials.reddit.userAgent,
            clientId: credentials.reddit.clientId,
            clientSecret: credentials.reddit.clientSecret,
            username: credentials.reddit.username,
            password: credentials.reddit.password,
        });

        try {
            const subreddit = await r.getSubreddit(super.getContent(event)[0]); //funny
            const topPosts = await subreddit.getTop({time: 'day', limit: 1});
            const post = topPosts[0];

            try {
                if (!post.quarantine && !post.over_18) {

                    this.message.body = post.title + '\n' + post.selftext

                    if (post.domain == 'v.redd.it') {

                        file = '/audio.mp4';
                        url = post.url + '/DASH_audio.mp4';
                        await super.downloadFile(url, mediaDir + file)

                        file = '/video.mp4';
                        url = post.secure_media.reddit_video.fallback_url;
                        await super.downloadFile(url, mediaDir + file)

                        await super.combine();

                        this.message.attachment = fs.createReadStream(mediaDir + '/outputfile.mp4');

                    } else if (post.domain == 'i.redd.it') {

                        file = '/image.png';
                        url = post.url;
                        await super.downloadFile(url, mediaDir + file)

                        this.message.attachment = fs.createReadStream(mediaDir + file);

                    } else {
                        this.message.body += post.url
                    }
                } else {
                    this.message.body = "that post is 18+"
                }
            }
            catch (err) {
                this.message.body = `Unable to get info from the sub: ${err}`;   
                console.error(`${err}`)             
            }
        } catch (err) {
            this.message.body = `Unable to find the sub: ${err}`;
            console.error(`${err}`)
        }

        super.send(event,api, this.message);
    }  
}