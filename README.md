# Tetris with rooms of two players!

We'll start by using the tetris game from (link to my other repository), and add a multiplayer functionality using Node.js, Expressjs and Socket.io.
This game will consist of a server which will be in charge of handling the game logic, listening for the player's input (arrow keys) and then sending the data of the game-grid (essentially sending each div with it's class to the client) and finally the client will render this data to it's screen.

The server will create rooms per a user request and will return the room's id which the player can then send to another player for they to join via an inner box. Each room will have a maximum of two players, the player with the best score wins! The room will be automatically deleted when the creator of the room exits. There will be a chat functionality when the game ends and a button to restart the game (a counter must be added before the game initialization).

1. The first screen will prompt the player to go single player or create a multiplayer room.

2. The singleplayer will be a copy of (my tetris repository) which runs on the client side.

3. The multiplayer will prompt for a user name (check if a user already has it) and ask to either create a room (return the room code and/or a link for someone to join directly) or to enter a room code to join. Then the room creator will be able to start the game once 2 players are on the lobby.

4. When multiplayer starts, it will show two game-grids, one on the left and one on the right. If a player loses their game grid will be frozen until the other player loses. At the end of the match there will be a chat at the bottom of the page and a 'new match' button for the room creator.

5. If the 2nd player leaves the room, the game-creator will be taken to the initial lobby(a notification will be shown). If the game creator leaves, the 2nd player will be redirected to the home page (after a message).
