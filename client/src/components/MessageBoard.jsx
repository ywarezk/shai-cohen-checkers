import React from "react";

const MessageBoard = ({ children, tick, bold }) => {

  let style = "message ";
  style += bold && "bold ";
  return (

    <div className="message-board">
      {
        
      children.map((message) => {
        return message &&   <p key={message} className={style}>{tick && '-'} {message}</p>;
      })
      }
    </div>
  );
};

export default MessageBoard;
