export const handleClickMove = (
  board,
  placeFrom,
  placeTo,
  isPlayer1,
  eatenSize,
  maxEatingPossible
) => {
  
  let boardDuplicate = board.map((row, i) =>
    row.map((square, j) => Object.assign({}, square))
  );

  let maxEatingForMove = 0;
  let newBoard = board.map((row, i) =>
    row.map((square, j) => Object.assign({}, square))
  );
  let isBoardChange = false;
  const res = checkSingleMove(
    boardDuplicate,
    placeFrom,
    placeTo,
    isPlayer1,
    eatenSize
  );

  maxEatingForMove = res.eatingSizeDirection + eatenSize;
  if (res.isValid) {
    if (maxEatingForMove) {
      if (maxEatingPossible === maxEatingForMove) {
        newBoard = makeMove(
          newBoard,
          placeFrom,
          placeTo,
          true,
          res.eatLocation,
          res.isMoveToKing
        );
        isBoardChange = true;
        eatenSize++;
      }
    } else if (maxEatingPossible === 0) {
      newBoard = makeMove(
        newBoard,
        placeFrom,
        placeTo,
        false,
        res.eatLocation,
        res.isMoveToKing
      );
      isBoardChange = true;
    }
  }

  return {
    newBoard,
    isBoardChange,
    eatenSize,
    isMoveToKing: res.isMoveToKing,
    isValid: res.isValid,
  };
};

const makeMove = (
  board,
  placeFrom,
  placeTo,
  isEat,
  eatLocation,
  isMoveToKing
) => {
  board[placeTo.i][placeTo.j].player = board[placeFrom.i][placeFrom.j].player;
  board[placeTo.i][placeTo.j].isKing = board[placeFrom.i][placeFrom.j].isKing;
  board[placeFrom.i][placeFrom.j].player = 0;
  board[placeFrom.i][placeFrom.j].isKing = false;
  if (isEat) {
    board[eatLocation.i][eatLocation.j].player = 0;
    board[eatLocation.i][eatLocation.j].isKing = false;
  }
  if (isMoveToKing) {
    board[placeTo.i][placeTo.j].isKing = true;
  }
  return board;
};

export const checkAvailableMoves = (fakeBoard, isPlayer1) => {
  let playerNumber = isPlayer1 ? 1 : 2;
  let maxEatingSizeGlobal = 0;
  let maxEatingSizeForPiece = 0;
  let isLeftMoves = false;
  let res = null;
  if (fakeBoard.length) {
    for (let i = 0; i < fakeBoard[0].length; i++) {
      for (let j = 0; j < fakeBoard[i].length; j++) {
        if (fakeBoard[i][j].player === playerNumber) {
          let distance = fakeBoard[i][j].isKing ? 7 : 2;
          res = checkMove(fakeBoard, { i, j }, distance, isPlayer1, false, [{i:-1,j:-1},{i:-1,j:1},{i:1,j:-1},{i:1,j:1}]);
          
          maxEatingSizeForPiece = res.localMaxEating;
          isLeftMoves = isLeftMoves || res.isLeftMoves;
          if (maxEatingSizeForPiece > maxEatingSizeGlobal) {
            maxEatingSizeGlobal = maxEatingSizeForPiece;
          }
        }
      }
    }
  }
  
  return { maxEatingSizeGlobal, isLeftMoves };
};

const checkMove = (fakeBoard, placeFrom, distance, isPlayer1, didEat, allowedDirections) => {
  let localMaxEating = 0;
  let eatingSizeDirection = 0;
  let isLeftMoves = false;
  for (let dist = 1; dist <= distance; dist++) {
      for(const dir of allowedDirections){
        const placeTo = {
          i: placeFrom.i + dist * dir.i,
          j: placeFrom.j + dist * dir.j,
        };
        if (
          placeTo.i >= 0 &&
          placeTo.i < fakeBoard.length &&
          placeTo.j >= 0 &&
          placeTo.j < fakeBoard.length
        ) {
          
          const res = checkSingleMove(
            fakeBoard,
            placeFrom,
            placeTo,
            isPlayer1,
            didEat
          );
          eatingSizeDirection = res.eatingSizeDirection;
          if (localMaxEating < eatingSizeDirection) {
            localMaxEating = eatingSizeDirection;
          }
          isLeftMoves = res.isValid || isLeftMoves;
        }
    }
  }
  return { localMaxEating, isLeftMoves };
};

const checkSingleMove = (fakeBoard, placeFrom, placeTo, isPlayer1, didEat) => {
  let eatingSizeDirection = 0;
  const { isValid, eatNow, isMoveToKing, eatLocation } = isValidMove(
    fakeBoard,
    placeFrom,
    placeTo,
    isPlayer1,
    didEat
  );
  let fakeMove = fakeBoard.map((row,i)=> row.map((square,j)=>  Object.assign({}, square)));
  if (isValid) {
    if (eatNow) {
      fakeMove = makeMove(
        fakeMove,
        placeFrom,
        placeTo,
        true,
        eatLocation,
        isMoveToKing
      );
      if(isMoveToKing){
        eatingSizeDirection++;
      }
      else{

        let distance = fakeMove[placeTo.i][placeTo.j].isKing ? 7 : 2;
        let directions;
        if(placeFrom.i > placeTo.i &&placeFrom.j > placeTo.j){
          directions =[{i:-1,j:-1},{i:-1,j:1},{i:1,j:-1}];
        }
        else if(placeTo.i > placeFrom.i && placeTo.j > placeFrom.j){
          directions =[{i:1,j:1},{i:-1,j:1},{i:1,j:-1}];
        }
        else if(placeTo.i > placeFrom.i && placeTo.j < placeFrom.j){
          directions =[{i:1,j:1},{i:-1,j:-1},{i:1,j:-1}];
        }
        else if(placeTo.i < placeFrom.i && placeTo.j > placeFrom.j){
          directions =[{i:1,j:1},{i:-1,j:-1},{i:-1,j:1}];
        }
        eatingSizeDirection =
          1 +
          checkMove(fakeMove, placeTo, distance, isPlayer1, true, directions).localMaxEating;
      
      }
  }
}
  return { isValid, eatingSizeDirection, eatLocation, isMoveToKing };
};

const isValidMove = (board, placeFrom, placeTo, isPlayer1, isEat) => {
  let pos = isPlayer1 ? -1 : 1;
  let opponentNumber = isPlayer1 ? 2 : 1;
  let isValid = false;
  let isMoveToKing = false;
  let eatNow = false;
  let eatLocation = {};
  if (
    board[placeTo.i][placeTo.j].isValid &&
    board[placeTo.i][placeTo.j].player === 0
  ) {
    if (board[placeFrom.i][placeFrom.j].isKing) {
      const res = isKingMoveValid(board, placeFrom, placeTo, opponentNumber);
      isValid = res.isValid;
      eatNow = res.eatNow;
      eatLocation = res.eatLocation;
    } else {
      if (isEat) {
        if (
          Math.abs(placeFrom.i - placeTo.i) === 2 &&
          Math.abs(placeFrom.j - placeTo.j) === 2
        ) {
          if (
            board[1 + Math.min(placeFrom.i, placeTo.i)][
              1 + Math.min(placeFrom.j, placeTo.j)
            ].player === opponentNumber
          ) {
            isValid = true;
            eatNow = true;
            eatLocation = {
              i: 1 + Math.min(placeFrom.i, placeTo.i),
              j: 1 + Math.min(placeFrom.j, placeTo.j),
            };
          }
        }
      } else {
        if (
          placeFrom.i + pos === placeTo.i &&
          Math.abs(placeFrom.j - placeTo.j) === 1
        ) {
          isValid = true;
        } else if (
          placeFrom.i + pos * 2 === placeTo.i &&
          Math.abs(placeFrom.j - placeTo.j) === 2
        ) {
          if (
            board[placeFrom.i + pos][1 + Math.min(placeFrom.j, placeTo.j)]
              .player === opponentNumber
          ) {
            isValid = true;
            eatNow = true;
            eatLocation = {
              i: placeFrom.i + pos,
              j: 1 + Math.min(placeFrom.j, placeTo.j),
            };
          }
        }
      }
      if (
        ((isPlayer1 && placeTo.i === 0) ||
        (!isPlayer1 && placeTo.i === board.length - 1)) && !board[placeFrom.i][placeFrom.j].isKing
      ) {
        isMoveToKing = true;
      }
    }
  }

  return {
    isValid,
    eatNow,
    isMoveToKing,
    eatLocation,
  };
};

const isKingMoveValid = (board, placeFrom, placeTo, opponentNumber) => {
  let isValid = false;
  let eatNow = false;
  let counterI = placeTo.i > placeFrom.i ? 1 : -1;
  let counterJ = placeTo.j > placeFrom.j ? 1 : -1;
  let eatCounter = 0;
  let eatLocation = {};

  if (Math.abs(placeFrom.j - placeTo.j) === Math.abs(placeFrom.i - placeTo.i)) {
    let i = placeFrom.i + counterI;
    let j = placeFrom.j + counterJ;
    if (Math.abs(placeFrom.i - placeTo.i) === 1) {
      isValid = true;
    } else {
      while (i !== placeTo.i && j !== placeTo.j) {
        if (board[i][j].player === opponentNumber) {
          eatCounter++;
          eatLocation = { i, j };
        } else if (
          board[i][j].player === board[placeFrom.i][placeFrom.j].player
        ) {
          eatCounter = 0;
          break;
        }
        i += counterI;
        j += counterJ;
      }

      eatNow = eatCounter === 1;
      isValid = eatNow;
      if (eatCounter !== 1) {
        eatLocation = {};
      }
    }
  }
  return {
    isValid,
    eatNow,
    eatLocation,
  };
};

export const gameRules = [
  "Rules:",
  "1. Red player opens the game, then players alternate their turns.",
  "2. Pieces always move diagonally forwards.",
  "3. To capture a piece of your opponent, your piece leaps over one of the opponent's pieces and lands in a straight diagonal line on the other side.",
  "4. If a player is able to make the capture, then the jump must be made.",
  "5. A player must take the longest jumps route possible.",
  "6. Single pieces may shift direction diagonally forward and backward during a multiple capture turn.",
  "7. When a piece reaches the furthest row, it is crowned and becomes a king.",
  "8. Kings are limited to moving one place diagonally but can move both forward and backward.",
  "9. Kings can capture a piece diagonally without distance restrictions.",
  "10. Kings are limited to moving one place diagonally but can move both forward and backward.",
  "11. A player wins the game when the opponent cannot make a move or all of the opponent's pieces have been captured.",
];
