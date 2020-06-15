const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
//setting up socketio
const socketio = require('socket.io');
const io = socketio(server);
const port = process.env.PORT || 3000;
//to parse the contents of the body, included in express
const bodyParser = require('body-parser');
//nedb
const Datastore = require('nedb');
const usersDb = new Datastore({ filename: './db/users.db' });
const roomsDb = new Datastore({ filename: './db/rooms.db' });
//utils
const { newUser, userLeave } = require('./utils/users');

//load databases
usersDb.loadDatabase();
roomsDb.loadDatabase();

//bodyparser initialization
app.use(bodyParser.urlencoded({ extended: true }));

//Serving static files
app.use('/', express.static(path.join(__dirname, 'public/home')));
app.use('/singleplayer', express.static(path.join(__dirname, 'public/singleplayer')));
app.use('/multiplayer', express.static(path.join(__dirname, 'public/multiplayer')));

//404 handling
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

//Run when a client connects
io.on('connection', (socket) => {
    // socket.emit('new message', socket.id);
    // socket.on('keypress', (ele) => {
    //     console.log(`${socket.id} says: ${ele}, ${socket.username}`);
    //     console.log(socket.handshake.headers.referer);
    // });

    //run when the client sends a newuser, checks the db and adds if not there
    socket.on('newUser', (username) => newUser(socket, username, usersDb));
    socket.on('disconnect', () => userLeave(socket.username, usersDb));
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

// app.use('/user/:id', function (req, res, next) {
//     console.log('Request Type:', req.method);
//     next();
// });

// app.get('/users/:userId/books/:bookId', (req, res) => {
// res.send(req.params);
// res.download('test.txt');
// });

//multiplayer username post request
// app.post('/multiplayer', (req, res) => {
//     res.redirect('back');
//     const { username } = req.body;
//     //add username to db if it doesn't exist
//     usersDb.find({ username: username }, (err, docs) => {
//         console.log(docs);
//         if (docs.length === 0 && username.length < 10) {
//             usersDb.insert({ username: username });
//         } else {
//             console.log('already exists');
//         }
//     });
// });
