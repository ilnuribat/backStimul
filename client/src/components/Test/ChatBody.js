import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { ADD_MUT } from './querys';
import AddNew from './AddNew';
import moment from 'moment';

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
      // messages: data.group.messages.edges
      messages: data
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
    // let mes = data.group.messages.edges;
    let mes = data || messages;
    let uid = localStorage.getItem('userid');

    this.stater(messages, data);

    return (
      <div className="left-bar-inner test">
        <AddMesMut>
          {(add, { data, loading, error }) => (
            <AddNew 
              append={this.appendMessage}
              add={({ id, text }) => add({ variables: { id: `${id}`, text } })}
            />
          )}
        </AddMesMut>
        <div className="scroller">
          {
            mes.map((el,i)=>{
              let tr = '';
              let color = '';
              let createdAt = el.node.createdAt
              let text = el.node.text
              let id = el.node.from.id
              let username = el.node.from.username
              let data = moment(createdAt).fromNow();
              
              if(id == uid){
                tr = 'me';
              }else{
                color = ""
              }

              return(
                <div className={'chmessage '+ tr } key={'chat-'+i} from={id}>
                  <div className="from-user small">от {username}</div>
                  <div className="nmessage">{text}<div className="when">{data}</div></div>
                </div>
              )
            })
          }

        </div>
      </div>
    );
  }
}