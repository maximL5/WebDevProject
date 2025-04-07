const io = require('socket.io')(3000);

io.on('connection', Socket => {
    console.log("connected to socket")
    console.log(Socket.id)
})