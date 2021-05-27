module.exports = class Listener {
    constructor() {}
  
    listen(event) {
        console.log(event.type)
    }
}