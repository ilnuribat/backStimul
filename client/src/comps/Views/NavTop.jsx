import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { graphql, compose } from "react-apollo";
// import NavTopInner from './NavTopInner';
// import Logo from './Logo.jpg'
import logoImg from '../Img/Logo';
import { qauf, _url } from '../../constants';
import { ALL_MESSAGE_CREATED, TASK_UPDATED, USER_TASK_UPDATED } from '../../GraphQL/Qur/Subscr';
import { cGetCountPrivates, cSetCountPrivates, chatListCacheUpdate, messagesCacheUpdate, objectCacheUpdate, getChat, getCUser } from '../../GraphQL/Cache';
import { getUnreadCount, TASK_INFO_SMALL } from '../../GraphQL/Qur/Query';
import { UserRow } from '../Parts/Rows/Rows';
import client from '../../client';


class NavTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunOnce: false,
    }
  }

    subscribe = () => {
      // console.warn("countPriv", this.state.countPriv)

      //Пишем в кеш тасков добавление или удаление тасков или пользователей в них (последнее автоматом)
      client.subscribe({
        query: USER_TASK_UPDATED,
      }).subscribe({
        next(data) {
          // console.warn("TASK CREATE/DELETE", data.data.userTaskUpdated)
          const newData = data.data.userTaskUpdated

          if (newData.action === "KICKED" && newData.user.id === localStorage.getItem('userid'))
            client.mutate({
              mutation: objectCacheUpdate,
              variables:{
                action: "deleteTask",
                taskId: newData.task.id,
                objectId: newData.task.objectId
              }
            })
          else if (newData.user.id === localStorage.getItem('userid'))
            client.mutate({
              mutation: objectCacheUpdate,
              variables:{
                value: newData.task,
                action: "createTask",
                taskId: newData.task.id,
                objectId: newData.task.objectId
              }
            })
        }})

      client.subscribe({
        query: TASK_UPDATED,
      }).subscribe({
        next(data) {
          console.warn("TASK UPDATED", data.data.taskUpdated)
        }
      })
      // call the "subscribe" method on Apollo Client
      //Подпись на все сообщения, адресованные тебе
      client.subscribe({
        query: ALL_MESSAGE_CREATED,
      }).subscribe({
        next(data) {
          // ... call updateQuery to integrate the new comment
          // into the existing list of comments
          let equalGroupMessage
          // console.warn(data.data.messageAdded)
          //пишем мессагу в кэш

          //проверяем на совпадение группы мессаги и текущего чата
          client.query({ query: getChat }).then(result => {
            !result.data.id ? equalGroupMessage = _.isEqual(data.data.messageAdded.groupId, localStorage.getItem('chatId')) :
              equalGroupMessage = _.isEqual(data.data.messageAdded.groupId, result.data.id)
            if (!equalGroupMessage) {
              if (data.data.messageAdded.from.id !== localStorage.getItem('userid')) {
                //если не совпадают, читаем все непрочитанные приваты
                client.query({ query: cGetCountPrivates }).then(result => {
                  const unr = result.data.unr + 1
                  //пишем суумму всех непрочитанных приватов

                  client.mutate({
                    mutation: cSetCountPrivates,
                    variables: {
                      unr: unr
                    },
                    // update: ({ data }) => { console.warn("DATA IS" ,data)}
                  }).then(result => {
                    if (result.errors) console.warn("ERROR WRITE TO CACHE: ", result.errors)
                  })
                });
              } // if #2
              //пишем в кеш lastmessage + счетчик
              client.mutate({
                mutation: chatListCacheUpdate,
                variables:{
                  value: data.data.messageAdded,
                  queryName: !data.data.messageAdded.objectId ? "directs" : "tasks",
                  counter: true,
                }
              })
            } // if #1
            else {
              client.query({ query: getCUser })
                .then(result =>
                {
                  console.warn(result)
                  client.mutate({
                    mutation: chatListCacheUpdate,
                    variables:{
                      value: data.data.messageAdded,
                      queryName: !data.data.messageAdded.objectId ? "directs" : "tasks",
                    }
                  }).then(() => client.query({ query: getCUser }).then(result => console.warn(result)))
                })

              // пишем в кеш lastmessage

            }
          })




          //Пишем в кеш (если он есть конечно) нужной группы полученную мессагу
          client.mutate({
            mutation: messagesCacheUpdate,
            variables: {
              lastMessage: data.data.messageAdded,
              queryName: !data.data.messageAdded.objectId ? "direct" : "task",
            }
          })
          //Пишем lastmessage в кеш таска
          if (data.data.messageAdded.objectId)
            client.query({ query: TASK_INFO_SMALL, variables: {id: data.data.messageAdded.groupId} })
              .then(result =>
                client.mutate({
                  mutation: objectCacheUpdate,
                  variables: {
                    value: data.data.messageAdded,
                    action: "lastMessage",
                    objectId: result.data.task.objectId,
                    taskId: data.data.messageAdded.groupId,
                  },
                })
              )
        },
        error(err) { console.error('err', err); },
      });
    }


    queryCounterDirects () {
      qauf(getUnreadCount(), _url, localStorage.getItem('auth-token')).then(a=>{
        if(a && a.data && a.data.user){
          let privs = 0;


          a.data.user.directs && a.data.user.directs.map((e) => {
            if(e && e.unreadCount){
              privs = privs + e.unreadCount
            }
          })
          a.data.user.tasks && a.data.user.tasks.map((e) => {
            if(e && e.unreadCount){
              privs = privs + e.unreadCount
            }
          })
          client.mutate({
            mutation: cSetCountPrivates,
            variables: {
              unr: privs
            }
          // update: ({ data }) => { console.warn("DATA IS" ,data)}
          }).then(result => {
            if (result.errors) console.warn("ERROR WRITE TO CACHE: ", result.errors)
          })
        }
      }).catch((e)=>{
        console.warn(e);
      });
    }

    componentDidMount (){
      if (!this.isRunOnce) {
        this.queryCounterDirects()
        this.subscribe()
        this.setState ({isRunOnce: true})
      }
    }

    render() {
      const { children, name, /*url,*/ cGetCountPrivates } = this.props;
      let img = this.props;

      if(!img){
        img = logoImg;
      }

      return (
        <div className = "NavTop" >
          <div className = "LogoNav" >
            {cGetCountPrivates && cGetCountPrivates.unr ? (<div className="TopCounter">+{cGetCountPrivates.unr}</div>) : null }
            <Link to="/login" >
              <UserRow size="38" icon={logoImg || img} view="Col" name={ name || localStorage.getItem('username') }></UserRow>
            </Link>
          </div> { /* <NavTopInner/> */ }  { children }
        </div>
      )
    }
}


NavTop.propTypes = {
  cGetCountPrivates: PropTypes.object.isRequired,
  client: PropTypes.object,
  // name: PropTypes.string,
  // children: PropTypes.array,
};

export default compose(
  graphql(cGetCountPrivates, { name: 'cGetCountPrivates' }),
)(NavTop);
