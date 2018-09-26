import React from "react";
import ChatBody from './ChatBody';
import MesQuery from './MesQuery';

const Chat = () => (
  <MesQuery>
    {(data, subscribeToMoreMes, refc) => (
      
      <ChatBody data={data} refc={refc} subscribeToMoreMes={subscribeToMoreMes} />
    )}
  </MesQuery>
);

export default Chat;

