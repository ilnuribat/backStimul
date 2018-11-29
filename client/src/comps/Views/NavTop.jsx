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
import { lastMessageCache, getlastMessageCache, cGetCountPrivates, cSetCountPrivates, messagesListCacheUpdate, privateListCacheUpdate, taskCacheUpdate, messagesCacheUpdate, objectCacheUpdate } from '../../GraphQL/Cache';
import { getUnreadCount } from '../../GraphQL/Qur/Query';
import { UserRow } from '../Parts/Rows/Rows';

class NavTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunOnce: false,
    }
  }

    subscribe = (client) => {
      console.warn("countPriv", this.state.countPriv)
      client.subscribe({
        query: USER_TASK_UPDATED,
      }).subscribe({
        next(data) {
          console.warn("TASK CREATE/DELETE", data.data.userTaskUpdated)
          const newData = data.data.userTaskUpdated

          newData.action === "KICKED" ?
            client.mutate({
              mutation: objectCacheUpdate,
              variables:{
                action: "deleteTask",
                taskId: newData.task.id,
                objectId: newData.task.objectId
              }
            })
            :
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
          //пишем мессагу в кэш

          // console.warn(data.data)

          client.mutate({
            mutation: lastMessageCache,
            variables: {
              lastMessage: data.data.messageAdded.text,
              lastMessageId: data.data.messageAdded.id,
              lastMessageGroupId: data.data.messageAdded.groupId
            },
            // update: ({ data }) => { console.warn("DATA IS" ,data)}
          }).then(result => {
            if (result.errors) console.warn("ERROR WRITE TO CACHE: ", result.errors)
            //проверяем на совпадение группы мессаги и текущего привата
            client.query({ query: getlastMessageCache }).then(result => {
              equalGroupMessage = _.isEqual(result.data.lastMessage.groupId, result.data.id)
              if (data.data.messageAdded.isDirect && !equalGroupMessage && data.data.messageAdded.from.id !== localStorage.getItem('userid')) {
                //если не совпадают, читаем все непрочитанные приваты
                client.query({ query: cGetCountPrivates }).then(result => {
                  const unr = result.data.unr + 1
                  //пишем суумму всех непрочитанных приватов

                  // this.saveCountPrivs(unr)
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

                //пишем в кеш юзербаров приватный счетчик
                client.mutate({
                  mutation: privateListCacheUpdate,
                  variables:{
                    value: {id: result.data.lastMessage.groupId},
                  }
                }).then(result => {
                  if (result.errors) console.warn("ERROR WRITE TO CACHE: ", result.errors)
                })
              }

            })
          })

          //Пишем в кеш (если он есть конечно) нужной группы полученную мессагу
          client.mutate({
            mutation: messagesCacheUpdate,
            variables: {
              lastMessage: data.data.messageAdded,
              queryName: data.data.messageAdded.isDirect ? "direct" : "task",
            },
          })
        },
        error(err) { console.error('err', err); },
      });
    }


    queryCounterDirects () {
      qauf(getUnreadCount(), _url, localStorage.getItem('auth-token')).then(a=>{
        if(a && a.data && a.data.user && a.data.user.directs){
          let privs = 0;

          a.data && a.data.user && a.data.user.directs && a.data.user.directs.map((e) => {
            if(e && e.unreadCount){
              privs = privs + e.unreadCount
            }


            return null
          })
          // this.saveCountPrivs(privs)

          this.props.client.mutate({
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
        this.subscribe(this.props.client)
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
  client: PropTypes.object.isRequired,
};

export default compose(
  graphql(cGetCountPrivates, { name: 'cGetCountPrivates' }),
)(NavTop);
