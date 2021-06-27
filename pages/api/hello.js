// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import socket from 'socket.io';

export default function handler(req, res) {
    // socket.on()
    res.status(200).json({ name: 'John Doe' })
}
