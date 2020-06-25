const { randomString } = require('./randomString');

function createRoomRequest(socket, database) {
    //add a part to check if the random string generated an already created room, if yes run the function again.
    let room = randomString(6, 'Aa#');
    socket.join(room, () => {
        //insert the room and username to the db
        database.insert({ room: room, users: { owner: socket.username } });
    });
    socket.emit('roomOwner', { room, owner: socket.username });
}

function findRoom(room, database, callback) {
    let result = new Promise((resolve, reject) => {
        database.find({ room: room }, (err, docs) => {
            resolve(docs);
        });
    });

    result.then((docs) => callback(docs));
}

module.exports = {
    createRoomRequest,
    findRoom
};
