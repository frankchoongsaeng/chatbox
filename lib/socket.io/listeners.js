const Message = require('../classes/message');

module.exports = function attachSocketListeners(
    io,
    socket,
    storage = null
) {
    console.log('connection from', socket.id);

    socket.on('user-joined', (data, cb) => {
        console.log(data);
        let m = new Message({
            joined: true,
            message: `${data.user} joined the chat`,
            user: data.user,
        });
        io.emit('joined', m);
        if (storage) storage.push(m);
        cb(storage)
    });

    socket.on('message', data => {
        let m = new Message({
            message: data.message,
            user: data.user,
        });
        io.emit('message', m);
        if (storage) storage.push(m);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'client disconnected');
        // if (storage) storage.push(new Message())
    });
};
