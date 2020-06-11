# Tetris with rooms of two players!
We'll start by using the tetris game from (link to my other repository), and add a multiplayer functionality using Node.js, Expressjs and Socket.io.
This game will consist of a server which will be in charge of handling the game logic, listening for the player's input (arrow keys) and then sending the data of the game-grid (essentially sending each div with it's class to the client) and finally the client will render this data to it's screen.

The server will create rooms per a user request and will return the room's id which the player can then send to another player for they to join via an inner box. Each room will have a maximum of two players, the player with the best score wins! The room will be automatically deleted when the creator of the room exits. There will be a chat functionality when the game ends and a button to restart the game (a counter must be added before the game initialization).
