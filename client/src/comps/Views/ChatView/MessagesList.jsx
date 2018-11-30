import React, { Component, Fragment } from "react";
import moment from 'moment';
import momentRu from 'moment/locale/ru';
import PropTypes from 'prop-types';
import { Query } from "react-apollo";

import { qauf, _url, colorHash } from '../../../constants';
import { MESSAGE_READ } from "../../../GraphQL/Qur/Subscr";
import { MESSAGE_QUERY } from "../../../GraphQL/Qur/Query";
import { messageRead_MUT } from "../../../GraphQL/Qur/Mutation";
import { Svg } from '../../Parts/SVG/index';
import { UserRow } from "../../Parts/Rows/Rows";

moment.locale('ru')

const toBottom = () => {
  if(document.getElementById("messageList")){
    const a = document.getElementById("messageList");

    a.scrollTop = a.scrollHeight;
  }
}

const subscribeToRead = (subscribeToMore, id) =>{
  // console.warn("SUBS", subscribeToMore, id)

  return subscribeToMore({
    document: MESSAGE_READ,
    variables: { id: id },
    shouldResubscribe: false,
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

  componentDidMount() {
    // this.props.subscribeToNewMessages();
    toBottom();
  }

  componentDidUpdate(){
    // console.warn("UPDATE!");
    // this.props.subscribeToNewMessages();
    toBottom();
  }

  render(){
    const { data } = this.props;
    let datas = '';
    let uid = localStorage.getItem('userid');
    let same = false;
    let usid = "";

    if(data && data.messages && data.messages.edges ){
      datas = data.messages.edges;
    }else{
      return(<div className="mess">нет данных</div>)
    }
    if(datas){
      let n = 0;
      let l = datas.length;

      return(
        <Fragment>
          {
            datas.map((e,i)=>{
              n++;
              let {node} = e;

              if(!node.from){
                return true
              }

              // console.log(e)

              let tr = 'them';
              let createdAt = node.createdAt || "none";
              let text = node.text || "none";
              let id = node.userId || "none";
              let username;

              if(node.from && node.from.username){
                username = node.from.username;
              }else{
                username = "none";
              }

              let date = moment(createdAt).format('D MMM, h:mm')/*.fromNow()*/ || "неизв.";
              let messageText = text;
              let read = node.isRead;

              if(id === uid){
                tr = 'me';
                username = "Я";
                username = "";
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
                  {/* <div className="msg-flex"> */}
                  {same ? (
                    <div className="msg-user" style={{color: colorHash.hex(username)}}>
                      {/* <UserRow name={username} icon="1" view="Col" /> */}
                    </div>


                  ) : (
                    <div className="msg-user" style={{color: colorHash.hex(username)}}>
                      {id !== uid ? (<UserRow name={username} icon="1" view="Col" />) : null}
                    </div>
                  )}
                  <blockquote className={"msgs"}>

                    <div className="text prewr">{messageText}</div>
                    <div className="f-row">
                      { id === uid ? (
                        <div className="chatIcon">
                          { !read ? (
                            <Query
                              query={MESSAGE_QUERY}
                              variables={{ id:node.id }}
                            >
                              {({ data, subscribeToMore }) => {
                                subscribeToRead(subscribeToMore, node.id);

                                return(
                                  <div className="events">{data.message && data.message.isRead ? <Svg svg="dblcheckack" /> : <Svg svg="dblcheck" />}  {
                                    // console.warn('subs read data',data)
                                  }</div>
                                )}
                              }
                            </Query>
                          ) : ( <Svg svg="dblcheckack" /> ) }
                        </div>
                      ) : null }

                      {date ? (<div className="msg-date">
                        {date}
                      </div>):null}
                    </div>

                  </blockquote>
                  {/* </div> */}
                </div>
              )
            })
          }
        </Fragment>
      )
    }
  }
}


MessagesList.propTypes = {
  data:PropTypes.object.isRequired,
};
