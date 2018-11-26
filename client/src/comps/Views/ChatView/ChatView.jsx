import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Mutation } from "react-apollo";
import AddNew from './AddNew';
import MessagesList from './MessagesList';
import { ADD_MUT } from "../../../GraphQL/Qur/Mutation";
import '../../../newcss/taskview.css'

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) => children(addMes, { data, loading, error }) }
  </Mutation>
);


class ChatView extends Component {
  constructor(props){
    super(props)
    this.messageList = React.createRef();
  }

  render() {

    return (
      <div className="Chat">
        <section id="messageList" ref={this.messageList} className="messages ChatMessages">
          <MessagesList {...this.props} />
        </section>

        <AddMesMut>
          {(add) => (
            <AddNew
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

