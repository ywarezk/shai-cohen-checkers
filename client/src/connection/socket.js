import io from 'socket.io-client'

export const socket = io(
    //"http://localhost:8000", { transport : ['websocket'] }
    );


// socket.on('player-number', pIndex=>{

// })
// socket.on("createNewGame", statusUpdate => {
//     console.log("A new game has been created! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
//     mySocketId = statusUpdate.mySocketId
// })
