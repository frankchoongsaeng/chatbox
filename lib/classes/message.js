const { v4: uuidv4 } = require('uuid');

class Message {
    constructor({ message, user, info = false }) {
        this.message = message;
        this.id = uuidv4();
        this.type = info ? 'info' : 'message';
        this.time = new Date().toISOString();
        this.user = user;
    }
}

module.exports = Message