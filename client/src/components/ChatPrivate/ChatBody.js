import React, { Component } from "react";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import moment from 'moment';
import { Query, Mutation, Subscription, graphql, compose  } from "react-apollo";
import { showCurrentGroup, ADD_MUT, getPrivateChat, GR_QUERY, PRIV_QUERY, MESSAGE_CREATED, MESSAGE_READ, MESSAGEREAD_MUT, messRead, MESSAGE_QUERY, messageRead_MUT } from '../../graph/querys';
import AddNew from './AddNew';
import Loading from '../Loading';
import { MsgCheck, MsgDblcheck, MsgDblcheckAck } from '../Svg/index';
import { qauf, _url } from '../../constants';

var colorHash = new ColorHash({lightness: 0.7, hue: 0.8});

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) => children(addMes, { data, loading, error }) }
  </Mutation>
);

const MessagesListData = (params) => {
  console.log("params",params)
  return(
  <Query
    query={params.query}
    variables={{ id: `${params.id}` }}
  >
    {({ subscribeToMore, ...result }) =>{
      return(
      <MessagesList
        priv={params.priv}
        {...result}

        subscribeToNewMessages={() =>{
          return subscribeToMore({
            document: MESSAGE_CREATED,
            variables: { id: params.id },

            updateQuery: (prev, { subscriptionData }) => {

              if (!subscriptionData.data) return prev;
              subscriptionData.data.messageAdded.from = {id: localStorage.getItem("userid"),username: localStorage.getItem("username"), __typename: "User"};
              subscriptionData.data.messageAdded.createdAt = Date.now();
              subscriptionData.data.messageAdded.isRead = false;
              const newFeedItem = {cursor: subscriptionData.data.messageAdded.id, node: subscriptionData.data.messageAdded,
              __typename: "MessageEdge" };
              console.log("newFeedItem2",subscriptionData)

              if(params.priv){
                return Object.assign({}, prev, {
                  direct: {
                    messages:{
                      edges: [...prev.direct.messages.edges, newFeedItem],
                      __typename: "MessageConnection"
                    },
                    __typename: "Direct"
                  }
                });
              }else{
                return Object.assign({}, prev, {
                  group: {
                    messages:{
                      edges: [...prev.group.messages.edges, newFeedItem],
                      __typename: "MessageConnection"
                    },
                    __typename: "Group"
                  }
                });
              }

            },
            onError: (err)=>{
              console.log('ERR-----',err)
            },
          })
        }

        }
      />
    )}
    }
  </Query>
)};

export class MessagesList extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.subscribeToNewMessages();
    toBottom();
  }

  componentDidUpdate(){
    toBottom();
  }

  render(){
    const { priv, data } = this.props;
    let datas = '';
    let uid = localStorage.getItem('userid');
    let same = false;
    let usid = "";

    if(priv && data.direct && data.direct.messages && data.direct.messages.edges ){
                datas = data.direct.messages.edges;
    }else if(data.group && data.group.messages && data.group.messages.edges ){
                datas = data.group.messages.edges;
    }else{
      return(<div className="mess">нет данных</div>)
    }
              if(datas){
                let n = 0;
                let l = datas.length;
                return(
                  <div>
                  {
                    datas.map((e,i,a)=>{
                      n++;
                      let {node} = e;
                      let tr = 'them';
                      let createdAt = node.createdAt || "none";
                      let text = node.text || "none";
                      let id = node.userId || "none";
                      let username = node.from.username || "none";
                      let date = moment(createdAt).fromNow() || "none";
                      let messageText = text;
                      let read = node.isRead;

                      if(id === uid){
                        tr = 'me';
                        username = "Я";
                      }else{
                        if( n === l ){
                          let notread = messageRead_MUT(node.id);
                          qauf(notread, _url, localStorage.getItem('auth-token')).then(a=>{
                            if(a && a.data){
                              console.log("Answer about read",a);
                            }
                          }).catch((e)=>{
                            console.warn("Err read",e);
                          });
                        }
                      }

                      usid === id ? same = true : same = false;
                      usid = id;

                      return(
                        <div className={'msg '+ tr} key={'chat-'+i} from={id}>
                          <div className="msg-flex">
                            {same ? ('') : (
                              <div className="msg-user" style={{color: colorHash.hex(username)}}>
                                {username}:</div>)}
                            <blockquote className="msgs">
                              <div className="text prewr">{messageText}</div>
                              <div>{node.id}</div>
                              <div className="f-row">
                                { id === uid ? (
                                  <div>
                                { !read ? (
                                  <Query
                                    query={MESSAGE_QUERY}
                                    variables={{ id:node.id }}
                                    >
                                    {({ data, loading, subscribeToMore }) => {
                                        subscribeToRead(subscribeToMore, node.id);

                                      return(
                                      <div className="events">{data.message && data.message.isRead ? <MsgDblcheckAck /> : <MsgDblcheck />}  {console.log('subs read data',data)}</div>
                                    )}
                                  }
                                  </Query>
                                          ) : ( <MsgDblcheckAck /> ) }
                                  </div>
                                ) : null }


                                <div className="msg-date">{date}</div>
                              </div>

                            </blockquote>
                          </div>
                        </div>
                      )
                    })
                  }
                  </div>
                )
              }
  }
}


class Fetch extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      loading: true,
      id: '',
      name: '',
      datas: [],
    }

    this.fillMessages = this.fillMessages.bind(this)
  }

  fillMessages(datas){
    if(datas && datas != this.state.messages){
      this.setState({
        messages: datas,
      })
    }
  }

  componentWillMount(){

  }


  render(){
    let { id, priv } = this.props;
    let { messages } = this.state;

    let _query = GR_QUERY;

    priv ? _query = PRIV_QUERY : null;

    return(
      <MessagesListData query={_query} id={id} priv={priv} />
    );
  }
}

class ChatBody extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      loading: true,
      id: '',
      name: '',
      datas: [],
    }
    this.messageList = React.createRef();
    this.toBottom = this.toBottom.bind(this)
  }


  componentDidMount(){
  }

  componentDidUpdate(){
  }

  toBottom(){
    // if(document.getElementById("messageList")){
    //       const a = document.getElementById("messageList");
    //       a.scrollTop = a.scrollHeight;

    //       const node = this.messageList.current;
    //       node.scrollTop = node.scrollHeight;
    // }

  }

  render() {
    let { id, name, priv, data } = this.props;
    let _query = GR_QUERY;

    priv ? _query = PRIV_QUERY : null;

    return (
      <div className="nChat flexbox2">
        <header className="chat-header col1">
          <section className="chat-header-section">
            <div className="chat-name online">{name ? name : 'Группа'}</div>
            <div className="small">
              описание:
              {' '}
              {id}
            </div>
          </section>
        </header>
        <section id="messageList" ref={this.messageList} className="messages col1">
        <Fetch priv={priv} id={id} />
        </section>

        <div className="rela col1" style={{textAlign: "center"}}>
          <AddMesMut>
            {(add) => (
              <AddNew
                add={({ id, text }) => add({ variables: { id: `${id}`, text } })}
                toBottom={()=>{this.toBottom();}}
              />
            )}
          </AddMesMut>
        </div>
      </div>
    );
  }
}

const toBottom = () => {
  if(document.getElementById("messageList")){
        const a = document.getElementById("messageList");
        a.scrollTop = a.scrollHeight;
  }
}

const subscribeToRead = (subscribeToMore, id) =>{
  return subscribeToMore({
    document: MESSAGE_READ,
    variables: { id: id },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;

      console.log("messread subs",subscriptionData)
      console.log("messread subs prev", prev)

      return Object.assign({}, prev, {
        message:{
          isRead: true,
          text: prev.message.text,
          __typename: prev.message.__typename,
        }
      });

    },
    onError: (err)=>{
      console.log('ERR-----',err)
    },
  })
}

ChatBody.propTypes = {
  showCurrentGroup: PropTypes.shape({
    currentGroup: PropTypes.string
  }).isRequired,
};


AddMesMut.propTypes = {
  children: PropTypes.func.isRequired,
};

ChatBody.defaultProps = {
};

export default compose(
  graphql(showCurrentGroup, { name: 'showCurrentGroup' }),
  graphql(getPrivateChat, { name: 'getchat' }),
)(ChatBody);
