const fs = require("fs");
var path = require('path');
const login = require("facebook-chat-api");


const databaseDir = path.resolve(__dirname + '/database/');

const credentials = JSON.parse(fs.readFileSync(databaseDir + '/credentials.json', 'utf8')); //gets credentials

console.log(credentials);

login(credentials, (err, api) => {
    if(err) return console.error(err); //error

    fs.writeFileSync(databaseDir + '/appstate.json', JSON.stringify(api.getAppState())); //store cookies
});