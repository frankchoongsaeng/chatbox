const Message = require('../classes/message')

module.exports = function attachSocketListeners({
    io,
    socket,
    storage = null,
    users = null,
}) {
    console.log('connection from', socket.id)

    function getOnlineUsersCount() {
        return users === null ? 0 : Object.keys(users).length
    }

    socket.on('user-joined', (data, cb) => {
        console.log(data)
        let m = new Message({
            info: true,
            message: `${data.user} joined the chat`,
            user: data.user,
        })

        if (storage) storage.push(m)
        if (users) users[socket.id] = data.user
        io.emit('joined', m)
        io.emit('online-users', getOnlineUsersCount())

        cb(storage)
    })

    socket.on('message', data => {
        let m = new Message({
            message: data.message,
            user: data.user,
        })
        io.emit('message', m)
        if (storage) storage.push(m)
    })

    socket.on('disconnect', () => {
        let m = new Message({
            info: true,
            message: `${users[socket.id]} left the chat`,
            user: users[socket.id],
        })

        if (storage) storage.push(m)
        if (users) delete users[socket.id]
        io.emit('message', m)
        io.emit('online-users', getOnlineUsersCount())

        console.log(socket.id, 'client disconnected')
    })

    // typing and typing-stopped are not be sent to the same user
    socket.on('typing', username => {
        socket.broadcast.emit('typing', username)
    })

    socket.on('typing-stopped', username => {
        socket.broadcast.emit('typing-stopped', username)
    })
}
