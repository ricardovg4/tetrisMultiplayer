const socket = io();
const submitButton = document.getElementById('submit-button');
const notification = document.querySelector('.notification');
const sectionUsername = document.querySelector('.section--username');
const sectionSelection = document.querySelector('.section--selection');

socket.on('new message', (msg) => {
    console.log(msg);
});

socket.on('notification', (notif) => {
    notification.textContent = notif;
    setTimeout(() => {
        notification.textContent = '';
    }, 3000);
});

socket.on('newUserSuccess', (msg) => {
    //fade the username section and show the room phase section
    sectionUsername.style = 'display:none';
    sectionSelection.style = 'display:flex';
});

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    socket.emit('newUser', username);
});
