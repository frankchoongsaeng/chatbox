const http = require('http');
const { parse } = require('url');
const next = require('next');
const socketio = require('socket.io');

const port = parseInt(process.env.PORT || '3006', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const Message = require('./lib/classes/message'); // get the Message contructor
const attachSocketListeners = require('./lib/socket.io/listeners');

// declare a variable to hold all the messages while server is alive
const messages = [];
// declare a variable to hold all the users
const users = {};

nextApp.prepare().then(() => {
    const server = http.createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        nextHandler(req, res, parsedUrl);
    });
    const io = new socketio.Server(server);

    io.on('connection', socket => {
        attachSocketListeners({ io, socket, storage: messages, users });
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
