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
    this.stater = this.stater.bind(this)
    this.forceUpdate = this.forceUpdate.bind(this)
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
    // let { messages } = this.state;

    // this.setState({
    //   messages: [...messages, message]
    // })
    // this.forceUpdate()
  }

  stater(state, props){
    if( state.length < props.length ){
      this.setState(
        {
          messages: props,
        }
      )
    }
  }

  render() {


    let { messages } = this.state;
    let { data } = this.props;
    let mes = data.group.messages.edges;
    let uid = localStorage.getItem('userid')

    this.stater(messages, mes);


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
              console.log(el)
              let tr = '';
              
              if(el.node.from.id == uid){
                tr = 'from-me';
              }

              return(
                <div className={'chmessage '+ tr } key={'chat-'+i} from={el.node.from.id}>
                <div className="message">{el.node.text}</div>
                <div className="from-user small">{el.node.from.username}</div>
                <div className="when"></div>
                </div>
              )
            })
          }

        </div>
      </div>
    );
  }
}