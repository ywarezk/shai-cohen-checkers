import React, { useEffect, useState } from "react";
import { checkAvailableMoves, gameRules, handleClickMove } from "../code/GameLogic";

import Board from "./Board";
import MessageBoard from "./MessageBoard";
import { socket } from "../connection/socket";

const Game = () => {
	// TODO: consider using useReducer instead of so many useState
	// TODO: some of the props you have to pass to child component and then to grandchild components in the component tree.
	// consider maybe to use context for passing information in the tree or combining redux
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [gameOn, setGameOn] = useState(false);
  const [board, setBoard] = useState([]);
  const [maxEatingPossible, setMaxEatingPossible] = useState(0);
  const [eatenSize, setEatenSize] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [moveMessage, setMoveMessage] = useState("");

  useEffect(() => {
    socket.on("player-number", (pIndex) => {
      let isPlayer1 = pIndex === 1;

      if (pIndex === 1 || pIndex === 2) {
        
		// TODO: not sure that i would choose to place the socket related stuff here
		// the components are used for UI and it seems more like data related logic
		// 
        socket.on("start", (board) => {
          setIsPlayer1(isPlayer1);
          setGameOn(true);
          setBoard(board);
          setIsPlayerTurn(isPlayer1);
          setMaxEatingPossible(0);
          setEatenSize(0);
          setMoveMessage('');
          setIsWon(false);
          setIsGameOver(false);
        });
        socket.on("player-disconnect", () => {

          setGameOn(false);
          setMaxEatingPossible(0);
          setEatenSize(0);
          setSelectedPiece(null);
        });
        socket.on("part-move", (newBoard) => {
          setBoard(newBoard);
        });

        socket.on("player-move", (board) => {
          setBoard(board);
          setIsPlayerTurn(true);
          let boardDuplicate = board.map((row, i) =>
            row.map((square, j) => Object.assign({}, square))
          );
          const res = checkAvailableMoves(boardDuplicate, isPlayer1);
          setMaxEatingPossible(res.maxEatingSizeGlobal);

          if (!res.isLeftMoves) {
            setIsGameOver(true);
            setIsWon(false);
            socket.emit("game-over");
          }
          setEatenSize(0);
        });
        socket.on("game-over", () => {
          setIsWon(true);
          setIsGameOver(true);
        });
      } else {
        setIsRoomFull(true);
      }
    });
  }, []);

  const handleClick = (i, j) => {
    if (board[i][j].isValid && isPlayerTurn) {
      if (board[i][j].player === 1 && isPlayer1 && !eatenSize) {
        setSelectedPiece({ i, j });
      } else if (board[i][j].player === 2 && !isPlayer1 && !eatenSize) {
        setSelectedPiece({ i, j });
      } else if (board[i][j].player === 0 && selectedPiece) {
        let isBoardChange = false;
        let newBoard = [];
        let tempEatenSize = eatenSize;
        const res = handleClickMove(
          board,
          selectedPiece,
          { i, j },
          isPlayer1,
          tempEatenSize,
          maxEatingPossible
        );
        setEatenSize(res.eatenSize);
        isBoardChange = res.isBoardChange;
        newBoard = res.newBoard;

        if (isBoardChange) {
          setBoard(newBoard);
          setMoveMessage("");
          if (res.eatenSize !== maxEatingPossible) {
            socket.emit("part-move", newBoard);
            setSelectedPiece({ i, j });
          } else {
            socket.emit("move", newBoard);
            setIsPlayerTurn(false);
            setSelectedPiece(null);
          }
        } else {
          if (res.isValid) {
            setMoveMessage("You must capture as much pieces as possible!");
          } else {
            setMoveMessage("Not a valid move.");
          }
        }
      }
    }
  };

  return (
    <div className="app-container">

      <MessageBoard tick bold>
        {isRoomFull
          ? ["Room is full, try again later"]
          : [
              isPlayer1 ? "You are the Red player" : "You are the White player",
              !gameOn && "Waiting for Second player",
              gameOn &&
                (isPlayerTurn
                  ? "It's your turn"
                  : "Waiting for second player turn..."),
              moveMessage && (
                <span style={{ color: "red" }}>{moveMessage}</span>
              ),
              isGameOver &&  <span style={{ color: "Green" }}>{isWon ? "You Won!" : "You Lost!"}</span> 
            ]}
      </MessageBoard>

      {gameOn && (
        <Board
          squares={board}
          onClick={handleClick}
          selectedPiece={selectedPiece}
        />
      )}
      <MessageBoard>{gameRules}</MessageBoard>
    </div>
  );
};

export default Game;
