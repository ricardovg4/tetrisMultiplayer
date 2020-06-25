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
const { createRoomRequest, findRoom } = require('./utils/rooms');
const { resolveNaptr } = require('dns');
//load databases
usersDb.loadDatabase();
roomsDb.loadDatabase();

//bodyparser initialization
app.use(bodyParser.urlencoded({ extended: true }));

// multiplayer query string
app.get('/multiplayer', (req, res) => {
    console.log(req.query);
    // first check if there are query strings for a room
    if (Object.entries(req.query).length !== 0) {
        findRoom(req.query.room, roomsDb, (docs) => {
            // if the room is found and active in the roomsDB then redirects
            if (docs.length !== 0) {
                // sends to multiplayer and saves the room in sessionStorage
                res.sendFile(path.join(__dirname), '/public/multiplayer/index.html');
                io.on('connection', (socket) => {
                    socket.join(req.query.room);
                    const doc = docs[0];
                    socket.emit('roomGuest', { room: doc.room, as: 'guest', _id: doc._id });
                });
            } else {
                // if the room is not found, redirect to home, add a message later on
                res.redirect('/');
            }
        });
        // if there are no qs, redirect to multiplayer
    } else {
        res.sendFile(path.join(__dirname), 'public/multiplayer/index.html');
    }
});

//Serving static files
//will probably replace this with appget and sendfile
app.use('/', express.static(path.join(__dirname, 'public/home')));
app.use('/singleplayer', express.static(path.join(__dirname, 'public/singleplayer')));
app.use('/multiplayer', express.static(path.join(__dirname, 'public/multiplayer')));

//404 handling
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

//Run when a client connects
io.on('connection', (socket) => {
    //run when the client sends a newuser, checks the db and adds if not there
    socket.on('newUser', (username) => newUser(socket, username, usersDb));
    socket.on('disconnect', () => userLeave(socket.username, usersDb));
    //should also include the client's timeout, otherwise the user is not deleted
    socket.on('createRoomRequest', () => createRoomRequest(socket, roomsDb));
    socket.on('sendMessage', (data) => {
        socket.to(data.room).emit('newMessage', data);
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

// app.get('/users/:userId/books/:bookId', (req, res) => {
// res.send(req.params);
// res.download('test.txt');
// });

// app.get('/multiplayer/:room', (req, res) => {
//     findRoom(req.params.room, roomsDb, (docs) => {
//         if (docs.length !== 0) {
//             res.send('yay!');
//             // res.redirect('/multiplayer');
//         } else {
//             res.send('room not found!');
//         }
//     });
// });
