import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import _ from 'lodash';
// import NavTopInner from './NavTopInner';
// import Logo from './Logo.jpg'
import logoImg from '../Img/Logo';
import { qauf, _url } from '../../constants';
import { ALL_MESSAGE_CREATED } from '../../GraphQL/Qur/Subscr';
import { lastMessageCache, getlastMessageCache, cGetCountPrivates, cSetCountPrivates, messagesListDirectUpdate, messagesListTaskUpdate } from '../../GraphQL/Cache';
import { getUnreadCount } from '../../GraphQL/Qur/Query';

class NavTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunOnce: false,
    }
  }

    static propTypes = {}

    //Подпись на все сообщения, адресованные тебе
    subscribe = (client) => {
      // call the "subscribe" method on Apollo Client
      this.subscriptionObserver = client.subscribe({
        query: ALL_MESSAGE_CREATED,
      }).subscribe({
        next(data) {
          // ... call updateQuery to integrate the new comment
          // into the existing list of comments
          let equalGroupMessage
          //пишем мессагу в кэш

          console.warn(data.data)

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
              }

            })
          })

          //Пишем в кеш (если он есть конечно) нужной группы полученную мессагу
          client.mutate({
            mutation: data.data.messageAdded.isDirect ? messagesListDirectUpdate : messagesListTaskUpdate,
            variables: {
              lastMessage: data.data.messageAdded.text,
              lastMessageId: data.data.messageAdded.id,
              lastMessageGroupId: data.data.messageAdded.groupId,
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

          a.data.user.directs.map((e) => {
            privs = privs + e.unreadCount

            return null
          })

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
        // this.queryCounterDirects()
        this.subscribe(this.props.client)
        this.setState({isRunOnce : true});
      }
    }

    render() {
      const { children, name, url } = this.props;
      let { img } = this.props;

      if (!img) {
        img = logoImg;
      }

      return (
        <div className = "NavTop" >
          <div className = "LogoNav" >
            <Link to = "/login" >
              <img src = { img }
                alt = { name || "" }
              />
            </Link>
          </div> { /* <NavTopInner/> */ } { localStorage.getItem('username') } { children }
        </div>
      )
    }
}


NavTop.propTypes = {
  // setRefGroups: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  // getRefGroups: PropTypes.shape({
  //   ref: PropTypes.bool
  // }).isRequired,
};


export default NavTop;
