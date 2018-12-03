import React, { Component, Fragment } from "react";
import moment from 'moment';
import momentRu from 'moment/locale/ru';
import PropTypes from 'prop-types';

import client from "../../../client";
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

let subsMsgs = []


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

  subscribeToRead = (id) => {
    //FIXME: timeout????
    setTimeout(() => {
      if (!subsMsgs.find(k => k === id)) {
        client.query({ query: MESSAGE_QUERY, variables: { id: id }}).then(result => {
          if (!result.data.message.isRead) {
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
            console.warn("ARRAY!", subsMsgs)
            console.warn(unsub)
          } //if
        } //query
        )
      }
    }, 200)

  }

  timeEdit(time){
    if(time){

      let a = '';
      let dif = moment(  moment(new Date()).format('YYYY MM D, h:mm:ss')  ).diff(   moment(time).format(' YYYY MM D, h:mm:ss')    ) / 3600000 ;

      if( dif > 12){
        a = moment(time).format('D MMM, h:mm');
      }else{
        a = moment(time).format('h:mm');
      }

      return a;
    }else{
      return ''
    }
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
              let createdAt = node.createdAt;
              let text = node.text || "none";
              let id = node.userId || "none";
              let username;

              if(node.from && node.from.username){
                username = node.from.username;
              }else{
                username = "none";
              }

              let date = "";

              createdAt ? date = this.timeEdit(createdAt) : date = '0:00';


              // let date = moment(createdAt).format('D MMM, h:mm')/*.fromNow()*/ || "неизв.";
              let messageText = text;
              let read = node.isRead;

              if(id === uid){
                tr = 'me';
                username = "Я";
                username = "";
                if (!read) this.subscribeToRead(node.id);
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
                          { read ? (
                            <div className="events"><Svg svg="dblcheckack" /> </div>
                          ) : ( <Svg svg="dblcheck" /> ) }
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
