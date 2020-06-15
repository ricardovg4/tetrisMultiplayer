function newUser(socket, username, database) {
    database.find({ username: username }, (err, docs) => {
        if (docs.length === 0 && username.length > 0 && username.length < 10) {
            database.insert({ username: username });
            socket.username = username;
            //add section to emit a newusersuccess event to the client
            socket.emit('newUserSuccess', `${username} has been added`);
        } else {
            console.log('already exists');
            socket.emit('notification', `the username ${username} already exists!`);
        }
    });
}

function userLeave(username, database) {
    if (username !== undefined) {
        database.remove({ username: username }, (err, numRemoved) => {
            console.log(`${username} left and was removed from db`);
        });
    }
}

module.exports = {
    newUser,
    userLeave
};
