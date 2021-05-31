const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");
const util = require("util");
const fs = require("fs");
const path = require("path");

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

function databaseDir(thread) {
  return path.resolve(appRoot + `/database/history-${thread}.json`);
}

async function createDatabases() {
  let databases = [];

  //create history for each thread
  for (var thread in config.allowed_threads) {
    databases.push(
      writeFilePromise(databaseDir(config.allowed_threads[thread]), "[]", {
        flag: "wx",
      })
    );
  }

  //intentionally not error handling (already existing databases *will* throw errors)
  try {
    await Promise.all(databases);
  } catch (err) {}
}

createDatabases();

module.exports = class Listener {
  constructor() {
    this.type = ["message_reply", "message"];
  }

  async listen(event) {
    if (this.type.indexOf(event.type) > -1) {
      try {
        //get buffer from json file
        const data = await readFilePromise(databaseDir(event.threadID), 'utf-8');

        let json = JSON.parse(data);

        //console.log(event)

        //adds to front of json
        json.unshift(event);

        //removes json file if history gets too long
        // if (json.length > config.history_length) {
        //   json.pop();
        // }

        //write json file with new object
        await writeFilePromise(
          databaseDir(event.threadID),
          JSON.stringify(json, null, "\t")
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
};
