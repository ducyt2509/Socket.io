const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.emit("connection", "User id : " + socket.id)
    socket.on('chat message', (msg, room) => {
        if (msg && room) {
            console.log("MSG AND ROOM")
            socket.join(room);
            io.to(room).emit('chat message', msg);
        } else if (msg && !room) {

            console.log("MSG ")
            io.emit('chat message', msg);
        } else {
            console.log("ROOM ")
            socket.join(room);
            io.to(room).emit('join room', "A new user connect to room :" + room);
        }
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
