import React from "react";
import ChatBody from './ChatBody';
import MesQuery from './MesQuery';

const Chat = ({id, name, priv}) => (
  // <MesQuery id={id} name={name} priv={priv}>

    // {(data, subscribeToMoreMes) => (
      <ChatBody id={id} name={name} priv={priv} />
    // )}
  // </MesQuery>
);

export default Chat;

