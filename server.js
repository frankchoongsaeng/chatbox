const http = require('http');
const { parse } = require('url');
const next = require('next');
const socketio = require('socket.io');

const port = parseInt(process.env.PORT || '3006', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server = http.createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        // const { pathname, query } = parsedUrl;
        nextHandler(req, res, parsedUrl);
    });
    const io = new socketio.Server(server);

    io.on('connection', socket => {
        console.log('connection from', socket.id);

        socket.on('user-joined', data => {
            console.log(data);
            io.emit('joined', `${data.user} joined the chat`);
        })

        socket.on('message', data => {
            io.emit('message', data)
        });

        socket.on('disconnect', () => {
            console.log(socket.id, 'client disconnected');
        });
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});

/*

const express = require('express');
const http = require('http');
const next = require('next');
const socketio = require('socket.io');

const port = parseInt(process.env.PORT || '3006', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app = express();
    const server = http.createServer(app);
    const io = new socketio.Server();
    io.attach(server);

    app.get('/hello', async (_, res) => {
        res.send('Hello World')
    });

    io.on('connection', (socket) => {
        console.log('connection');
        socket.emit('status', 'Hello from Socket.io');

        socket.on('disconnect', () => {
            console.log('client disconnected');
        })
    });

    app.all('*', (req, res) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});

*/
