const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");
const util = require("util");
const fs = require("fs");
const path = require("path");

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

//should probably move this to a higher class
function databaseDir(name, thread) {
  return path.resolve(appRoot + `/database/${name}-${thread}.json`);
}

async function createDatabases() {
  let databases = [];

  //create history for each thread
  for (var thread in config.allowed_threads) {
    databases.push(
      writeFilePromise(
        databaseDir("deleted", config.allowed_threads[thread]),
        "[]",
        {
          flag: "wx",
        }
      )
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
    this.type = ["message_unsend"];
  }

  async listen(event) {
    if (this.type.indexOf(event.type) > -1) {
      try {

        //get history
        let data = await readFilePromise(
          databaseDir("history", event.threadID)
        );

        let history = JSON.parse(data);

        //find deleted message index via messageID
        let index = history.findIndex((msg) => {
          return msg.messageID === event.messageID;
        });

        //read deleted
        data = await readFilePromise(databaseDir("deleted", event.threadID));

        let deleted = JSON.parse(data);

        //add deleted message to front of list
        deleted.unshift(history[index]);
        history.splice(index, 1);

        if (deleted.length > config.deleted_length) {
          deleted.pop();
        }

        await writeFilePromise(
          databaseDir("deleted", event.threadID),
          JSON.stringify(deleted, null, "\t")
        );

        await writeFilePromise(
          databaseDir("history", event.threadID),
          JSON.stringify(history, null, "\t")
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
};
