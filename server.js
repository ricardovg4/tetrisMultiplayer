const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

//Routing
// app.use('/user/:id', function (req, res, next) {
//     console.log('Request Type:', req.method);
//     next();
// });

// app.get('/users/:userId/books/:bookId', (req, res) => {
// res.send(req.params);
// res.download('test.txt');
// });
app.use('/', express.static(path.join(__dirname, 'public/home')));
app.use('/singleplayer', express.static(path.join(__dirname, 'public/singleplayer')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'));
// });

io.on('connection', (socket) => {
    socket.emit('new message', socket.id);
    socket.on('keypress', (ele) => console.log(`${socket.id} says: ${ele}, ${socket.username}`));
});

//404 handling
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});
