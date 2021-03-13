import Piece from './Piece';
import React from 'react';

const Square = ({square, onClick,isSelected}) => {

    let style = square.isValid? `square valid` : 'square';
    return(
        <div className={style} onClick={onClick}>
             {square.player!==0&&
            <Piece piece={square} isSelected={isSelected}/>} 
        </div>
    )

}

export default Square;