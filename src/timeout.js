module.exports = class Timeout {

    constructor(time) {
        this.time = time;
        this.timeout = {};
    }

    inTimeout(threadID) {
        return this.timeout[threadID];
    }

    threadTimeout(threadID) {
        this.timeout[threadID] = true;
        setTimeout(() => {this.timeout[threadID] = false;}, this.time);
    }
}


