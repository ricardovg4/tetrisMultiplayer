// Require socket.io
const socket = io();
// Retrieve the buttons
const buttonUsername = document.getElementById('button-username');
const buttonRoom = document.getElementById('button-room');
const notification = document.querySelector('.notification');
const chatInput = document.getElementById('chat-input');
const messages = document.querySelector('.messages');
// Retrieve the sections
const sectionUsername = document.querySelector('.section--username');
const sectionSelection = document.querySelector('.section--selection');
const sectionPrelobby = document.querySelector('.section--pre-lobby');
const sectionLobby = document.querySelector('.section--lobby');
// Room code injection
const roomCode = document.getElementById('room-code');
const roomLink = document.getElementById('room-link');

// USERNAME

// when the username is submitted, the client emits the intent to the server
buttonUsername.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    socket.emit('newUser', username);
});

// client receives a notif message (such as: username already exists), prints and fades out
socket.on('notification', (notif) => {
    notification.textContent = notif;
    setTimeout(() => {
        notification.textContent = '';
    }, 3000);
});

// when user is valid and added to the db, the selection section is displayed
socket.on('newUserSuccess', (username) => {
    // fade the username section and show the room phase section
    if (!sessionStorage.getItem('room')) {
        sectionUsername.style = 'display:none';
        sectionSelection.style = 'display:flex';
    } else {
        sectionUsername.style = 'display:none';
        sectionLobby.style = 'display:flex';
        chatInput.focus();
    }
    // setting session storage for username
    sessionStorage.setItem('username', username);
});

// ROOM
// when the "create a room" button is submitted, the client emits the request for a room
buttonRoom.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('createRoomRequest', '');
});

socket.on('roomOwner', (roomObj) => {
    const { room } = roomObj;
    sectionSelection.style = 'display:none';
    sectionPrelobby.style = 'display:flex';
    roomCode.textContent = `room code: ${room}`;
    roomLink.textContent = `Or share: http://localhost/multiplayer/${room}`;
});

socket.on('user', (user) => console.log(user));

// when the client joins an existing room successfuly
socket.on('roomGuest', (currentRoom) => {
    console.log(currentRoom);
    for (ele in currentRoom) {
        sessionStorage.setItem(ele, currentRoom[ele]);
    }
    console.log('data sent');
});

// Chat input
function addMessage(data) {
    const li = document.createElement('li');
    li.classList.add('messages__item');
    // creating the username span
    const userSpan = document.createElement('span');
    userSpan.classList.add('messages__item__user');
    userSpan.textContent = `${data.username}: `;
    // creating the msg span
    const msgSpan = document.createElement('span');
    msgSpan.classList.add('messages__item__msg');
    msgSpan.textContent = data.message;
    // append all
    li.append(userSpan, msgSpan);
    messages.append(li);
}

chatInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        const msg = chatInput.value;
        chatInput.value = '';
        data = { message: msg, username: sessionStorage.username, room: sessionStorage.room };
        addMessage(data);
        socket.emit('sendMessage', data);
    }
});

socket.on('newMessage', (data) => {
    addMessage(data);
});
