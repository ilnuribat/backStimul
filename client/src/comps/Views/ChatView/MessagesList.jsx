import React, { Component, Fragment } from "react";
import moment from 'moment';
import momentRu from 'moment/locale/ru';
import PropTypes from 'prop-types';
import client from '../../../client';

import { qauf, _url, colorHash } from '../../../constants';
import { messageRead_MUT } from "../../../GraphQL/Qur/Mutation";
import { Svg } from '../../Parts/SVG/index';
import { UserRow } from "../../Parts/Rows/Rows";
import { PRIV_QUERY } from "../../../GraphQL/Qur/Query";

moment.locale('ru')

const toBottom = () => {
  if(document.getElementById("messageList")){
    const a = document.getElementById("messageList");

    a.scrollTop = a.scrollHeight;
  }
}

// let subsMsgs = []


export default class MessagesList extends Component {
  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    // this.props.subscribeToNewMessages();
    document.getElementById("messageList").addEventListener('scroll', this.handleScroll, { passive: true })

    toBottom();
  }

  componentDidUpdate(){
    // console.warn("UPDATE!");
    // this.props.subscribeToNewMessages();
    toBottom();
  }

  handleScroll(event) {
    if (event.target.scrollTop == 0){
      console.warn(event, event.target.scrollTop)
      document.getElementById("PaddedComp").style.height = "30px"
      setTimeout(()=>{document.getElementById("PaddedComp").style.height = "0"}, 300)
      console.warn("DATA IS", this.props.data.messages.edges[0].cursor)
      client.query({ query: PRIV_QUERY,  variables:{ id: this.props.data.id, messageConnection: {last: 10, before: this.props.data.messages.edges[0].cursor } } })
        .then(result => console.warn(result))

    }
  }

  // subscribeToRead = (id) => {
  //   //FIXME: timeout????
  //   setTimeout(() => {
  //     if (!subsMsgs.find(k => k === id)) {
  //       client.query({ query: MESSAGE_QUERY, variables: { id: id }}).then(result => {
  //         if (!result.data.message.isRead) {
  //           const unsub = client.subscribe({
  //             query: MESSAGE_READ,
  //             variables: { id: id },
  //           }).subscribe({
  //             next(data) {
  //               // console.warn("MESSAGE ISREAD!! UPDATED", data.data.messageRead)
  //               subsMsgs = subsMsgs.filter(el => el != id)
  //               unsub.unsubscribe()
  //             }
  //           })

  //           subsMsgs = [...subsMsgs, id]
  //           console.warn("ARRAY!", subsMsgs)
  //           console.warn(unsub)
  //         } //if
  //       } //query
  //       )
  //     }
  //   }, 0)

  // }

  timeEdit(time) {
    if (time) {

      let a = '';
      let dif = '';

      /** If day off */
      dif = moment(moment().toISOString()).diff(moment(time).toISOString()) / 3600000;//3600000;

      if (moment(time).format("YYYY") !== moment().format("YYYY")) {
        a = moment(time).format("YYYY DD MMM, hh:mm");
      }
      else if (dif < 12 && moment(time).format("YYYY") == moment().format("YYYY")) {
        a = moment(time).format("DD MMM, hh:mm");
      }
      else {
        a = moment(time).format("hh:mm");
      }

      return a;
    } else {
      return ''
    }
  }

  render(){
    const { data } = this.props;
    let datas = '';
    let uid = localStorage.getItem('userid');
    let same = false;
    let usid = "";

    console.warn("aaa", data.id)

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
                // if (!read) this.subscribeToRead(node.id);
              }else{
                if( n === l ){
                  // console.warn ("LAST MESSAGE!")
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
                  <blockquote className={"msgs"} id={id}>

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
