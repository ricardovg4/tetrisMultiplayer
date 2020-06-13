const socket = io();

socket.on('new message', (msg) => {
    console.log(msg);
});

document.addEventListener('keydown', keypress);

function keypress(e) {
    socket.emit('keypress', e.keyCode);
}
