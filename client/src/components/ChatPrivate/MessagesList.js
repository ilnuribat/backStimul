import React, { Component } from "react";
import moment from 'moment';
import { Query, compose  } from "react-apollo";

import { MsgDblcheck, MsgDblcheckAck } from '../Svg/index';
import { qauf, _url, colorHash } from '../../constants';
import { MESSAGE_READ, MESSAGE_QUERY, messageRead_MUT } from '../../graph/querys';

let ref1;

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

      return Object.assign({}, prev, {
        message:{
          isRead: true,
          text: prev.message.text,
          __typename: prev.message.__typename,
        }
      });

    },
    onError: (err)=>{
      console.warn('ERR-----',err)
    },
  })
}

export default class MessagesList extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.subscribeToNewMessages();
    toBottom();
    if (ref1) ref1();
  }

  componentDidUpdate(){
    // console.warn("UPDATE!");
    if (ref1) ref1();
    // this.props.subscribeToNewMessages();
    toBottom();
  }

  render(){
    if (ref1) ref1();
    const { priv, data, } = this.props;

    // console.warn("our group is: ", variables.id )

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

              // console.log(e)

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
                      // console.warn("Answer about read",a);
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
                    <blockquote className={"msgs"}>

                      <div className="text prewr">{messageText}</div>
                      <div className="f-row">
                        { id === uid ? (
                          <div>
                            { !read ? (
                              <Query
                                query={MESSAGE_QUERY}
                                variables={{ id:node.id }}
                              >
                                {({ data, loading, subscribeToMore, refetch }) => {
                                  subscribeToRead(subscribeToMore, node.id);
                                  ref1 = refetch;

                                  return(
                                    <div className="events">{data.message && data.message.isRead ? <MsgDblcheckAck /> : <MsgDblcheck />}  {
                                      // console.warn('subs read data',data)
                                    }</div>
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
