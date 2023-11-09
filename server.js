const express = require('express')
const app = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {

    var name = req.body.name;

    if (name === "cushi") {
        res.sendFile(__dirname + '/chat.html')

    }
    else {
        res.sendFile(__dirname + '/error.html')
    }

})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html')
})

// Socket 

const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
