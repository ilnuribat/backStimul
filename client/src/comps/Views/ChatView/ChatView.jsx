import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Mutation } from "react-apollo";
import client from "../../../client";
import AddNew from './AddNew';
import MessagesList from './MessagesList';
import { ADD_MUT } from "../../../GraphQL/Qur/Mutation";
import { MESSAGE_READ } from "../../../GraphQL/Qur/Subscr";
import '../../../newcss/taskview.css'
import { UserRow } from "../../Parts/Rows/Rows";

let subsMsgs = []

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) => {
      if (data) {
        subscribeToRead(data.createMessage.id)
        console.warn("New message", data.createMessage.id)
      }

      return children(addMes, { data, loading, error })
    } }
  </Mutation>
);

const subscribeToRead = (id) => {
  // console.warn("NEW SUB", id)
  if (!subsMsgs.includes(id)) {
    const unsub = client.subscribe({
      query: MESSAGE_READ,
      variables: { id: id },
    }).subscribe({
      next(data) {
        // console.warn("MESSAGE ISREAD!! UPDATED", data.data.messageRead)
        subsMsgs = subsMsgs.filter(el => el != id)
        unsub.unsubscribe()
      }
    })

    subsMsgs = [...subsMsgs, id]
    // console.warn("ARRAY!", subsMsgs)
    // console.warn(unsub)
  }
}

class ChatView extends Component {
  constructor(props){
    super(props)
    this.state = {
      isRunOnce: false,
    }
    this.messageList = React.createRef();
  }

  componentDidMount (){
    if (!this.isRunOnce) {
      const { data } = this.props;

      if(data && data.messages && data.messages.edges ){
        data.messages.edges.map ((e)=>{
          if (!e.node.isRead && e.node.userId === localStorage.getItem('userid'))
            subscribeToRead(e.node.id);
        })
      }

      this.setState ({isRunOnce: true})
    }
  }

  render() {
    return (
      <div className="Chat">
        <div className="ChatTop">
          <UserRow id="id" name={this.props.name} icon="1" iconright="1"></UserRow>
        </div>
        <section id="messageList" ref={this.messageList} className="messages ChatMessages">
        <div id="PaddedComp" className="PaddedComp"></div>
          <MessagesList {...this.props} />
        </section>

        <AddMesMut>
          {(add) => (
            <AddNew
              id={this.props.id}
              key={this.props.id}
              add={({ id, text }) => add({ variables: { id: `${id}`, text } })}
            />
          )}
        </AddMesMut>
      </div>
    );
  }
}

AddMesMut.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChatView;

