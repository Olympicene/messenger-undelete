const time = 30000;
var timeout = {};

function inTimeout(threadID) {
    return timeout[threadID];
}

function threadTimeout(threadID) {
    timeout[threadID] = true;
    setTimeout(() => {timeout[threadID] = false;}, time);
}

module.exports = {
    inTimeout,
    threadTimeout,
 }
