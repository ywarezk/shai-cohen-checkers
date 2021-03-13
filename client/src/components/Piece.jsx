import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import { faCrown } from '@fortawesome/free-solid-svg-icons'

const Piece = ({ piece, isSelected }) => {
    let style = piece.player===1 ? `circle player1` : `circle player2`;

    style+= isSelected ? " selected" : "";

    return(
        <div className={ `piece ${style}`} >
            
            {piece.isKing&&
             <FontAwesomeIcon icon={faCrown} className="king"/>
        }
        </div>
    )

}

export default Piece;