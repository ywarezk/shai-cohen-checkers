const connections = [null,null];
const boardSize = 8;
let board = [];
class Square {
  player;
  constructor(isValid, player) {
    this.isValid = isValid;
    this.player = player;
    this.isKing = false;
  }
}

export const initializeGame = (sio, socket) => {
  let playerIndex = -1;
  for (var i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
      break;
    }
  }

    connections[playerIndex] = socket;
    let playerNumber= parseInt(playerIndex)+1;
    socket.emit('player-number', playerNumber);
    if (playerIndex == -1) return;
    socket.broadcast.emit('player-connect', playerIndex);

   if (connections[0]!=null &&connections[1]!=null) {
    initBoard();
    socket.emit("start", board);
    socket.broadcast.emit("start", board);

  }
  
 

  socket.on('move', (board) => {
    socket.broadcast.emit("player-move", board);
  });

  socket.on('part-move', (board) => {
    socket.broadcast.emit("part-move", board);
  });

  socket.on('game-over', () => {
    socket.broadcast.emit("game-over");
  });

  socket.on('disconnect', data=>{
    console.log(`Player ${playerNumber} Disconnected`);
    connections[playerIndex] = null;
    socket.broadcast.emit("player-disconnect", );
  });



};

const initBoard = () => {
  board = [] ;
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      if (i % 2 == 0) {
        if (j % 2 !== 0) {
          if (i < 3) {
            board[i][j] = new Square(true, 2);
          } else if (i > boardSize - 4) {
            board[i][j] = new Square(true, 1);
          } else {
            board[i][j] = new Square(true, 0);
          }
        }
        else{
          board[i][j] = new Square(false, 0);
        }
      } else {
        if (j % 2 == 0) {
          if (i < 3) {
            board[i][j] = new Square(true, 2);
          } else if (i > boardSize - 4) {
            board[i][j] = new Square(true, 1);
          } else {
            board[i][j] = new Square(true, 0);
          }
        }
        else{
          board[i][j] = new Square(false, 0);
        }
      }
    }
  }
};