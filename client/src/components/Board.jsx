import React from 'react';
import Square from './Square'

// TODO: a component should have a well defined contract
// which means you have to set propTypes: https://reactjs.org/docs/typechecking-with-proptypes.html
// and also set default values in case some props have default value
const Board=({squares, onClick, selectedPiece})=>{
    return(
    <div className="board">
        {squares.map((row,i)=>
        row.map((square,j)=>
        {

            return <Square key={`${i}-${j}`}
            square={square}
            isSelected={(selectedPiece!=null && (selectedPiece.i===i &&selectedPiece.j===j)) ? true : false}
            
            onClick={()=>onClick(i,j)}/>
        }
        
        ))}
       
    </div>
    )
}

export default Board;