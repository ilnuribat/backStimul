import React from "react";
import ChatBody from './ChatBody';
import MesQuery from './MesQuery';

const Chat = () => (
  <MesQuery>
    {(messages, subscribeToMoreMes, refc) => (
      <ChatBody messages={messages} refc={refc} subscribeToMoreMes={subscribeToMoreMes} />
    )}
  </MesQuery>
);

export default Chat;

