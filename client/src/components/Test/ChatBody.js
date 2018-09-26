import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { ADD_MUT } from './querys';
import AddNew from './AddNew';

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) =>
      children(addMes, { data, loading, error })
    }
  </Mutation>
);

export default class ChatBody extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: {},
      messages: [],
      messagesInt: 0,
      
    }

    this.update = this.update.bind(this)
    this.appendMessage = this.appendMessage.bind(this)
  }

  componentDidMount() {
    let { data, subscribeToMoreMes } = this.props;

    this.setState({
      messages: data.group.messages.edges
    });
    subscribeToMoreMes();
  }
  update(){
  }

  appendMessage(message){
    let { messages } = this.state;

    this.setState({
      messages: [...messages, message]
    })
  }

  render() {
    let { messages } = this.state;

    return (
      <div className="left-bar-inner test">
        <AddMesMut>
          {(add, { data, loading, error }) => (
            <AddNew 
              append={this.appendMessage}
              add={({ id, text }) => add({ variables: { id, text } })}
            />
              
          )}
        </AddMesMut>
        <div className="scroller">
          {
            messages.map((el,i,arr)=>{
              return(
                <div className="chmessage" key={i}>{el.node.text}</div>
              )
            })
          }

        </div>
      </div>
    );
  }
}