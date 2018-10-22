import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import _ from 'lodash';
import PropTypes from 'prop-types';
import Private from './Nav/Private';
import Groups from './Nav/Groups';
import Profile from './Nav/Profile';
import Board from './Nav/Board';
import Map from './Nav/Map';

import Loading from './Loading';
import { qauf, _url } from '../constants';
import { getlastMessageCache, lastMessageCache, getUnreadCount, cSetCountPrivates, cGetCountPrivates, ALL_MESSAGE_CREATED, taskUpdated, TASKS_QUERY, setRefGroups, getRefGroups } from '../graph/querys';

let refUser;

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunOnce: false,
    }
  }

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
          client.query({query:getlastMessageCache}).then(result => {
            equalGroupMessage = _.isEqual(result.data.lastMessage.groupId, result.data.id)
            if (!equalGroupMessage && data.data.messageAdded.from.id !== localStorage.getItem('userid')) {
              //если не совпадают, читаем все непрочитанные приваты
              client.query({query:cGetCountPrivates}).then(result => {
                const unr = result.data.unr +1
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
        // console.warn("new private message", data)
      },
      error(err) { console.error('err', err); },
    });
  }

  shouldComponentUpdate(nextProps,nextState){

    if(nextProps.getRefGroups.ref){
      return true;
    }else{
      return false;
    }
  }

  componentDidUpdate(){

    console.log("Update Nav")

    let {getRefGroups, setRefGroups} = this.props;

    if(!!getRefGroups.ref && !!refUser){

      refUser().then(()=>{
        setRefGroups({
          ref: false,
        })
      })
    }
  }

  componentDidMount (){
    if (!this.isRunOnce) {
      this.queryCounterDirects()
      this.subscribe(this.props.client)
      this.setState({isRunOnce : true});
    }
  }

  queryCounterDirects () {
    qauf(getUnreadCount(), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data && a.data.user && a.data.user.directs){
        let privs = 0;

        a.data.user.directs.map((e) => {
          privs = privs + e.unreadCount

          return null
        })

        this.props.cSetCountPrivates({
          variables: { unr: privs }
        });

      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  render () {
    return(
      <Fragment>
        <nav className="left-nav">
          <Profile />
          <Groups />
          <Board />
          <Private />
          <Map />
          <Query query={TASKS_QUERY} >
            {({ loading, error, data, refetch, subscribeToMore }) => {
              if (loading){
                return (
                  <div style={{ paddingTop: 20, margin: "auto"}}>
                    <Loading />
                  </div>
                );
              }
              if (error){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }

              if(data){

                console.log("tasks",data);

                data.user.groups.map((e,i)=>{
                  let id = e.id;
                  // return(
                  //         <Subscription
                  //           subscription = {taskUpdated} variables={{id: id}}>
                  //           {({ data, error }) => {
                  //             if(error){
                  //               console.log(error)
                  //             }
                  //             console.warn("tasks____", data);
                  //             return data;
                  //           }}
                  //         </Subscription>
                  //       )

                  let subs = () =>{
                    subscribeToMore({
                      document: taskUpdated,
                      variables: { id: id },
                      updateQuery: (prev, { subscriptionData }) => {
                        refUser = refetch;
                        if (!subscriptionData.data) return prev;
                        const newFeedItem = subscriptionData.data.commentAdded;

                        console.warn(prev);
                        console.warn(subscriptionData);
                        refetch();

                        return true;

                        // return Object.assign({}, prev, {
                        //   user: {
                        //     groups: [newFeedItem, ...prev.entry.comments]
                        //   }
                        // });
                      }
                    });
                  };

                  subs();


                  // subscribeToMore();
                  // return(
                  //   <Subscription
                  //     subscription = {taskUpdated} variables={{id}}>
                  //     {({ data }) => {
                  //       console.warn("tasks____", data);
                  //       return data;
                  //     }}
                  //   </Subscription>
                  // )
                });

                return true;


              }



              // if(data && data.user && data.user.directs){
              //   let privs = 0;

              //   data.user.directs.map((e,i)=>{
              //     privs = privs + e.unreadCount;
              //   })


              //   this.props.cSetCountPrivates({
              //     variables: { unr: privs }
              //   });
              // }



              return true;
            }}
          </Query>

        </nav>
      </Fragment>
    )
  }
}

// const subscrTasks = (id)=> {
//   <Subscription
//     subscription = {taskUpdated} variables={id}>
//     {({ data }) => {
//       console.warn("tasks", data)
//     }}
//   </Subscription>
// }


LeftNav.propTypes = {
  cSetCountPrivates: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

export default compose(
  graphql(cSetCountPrivates, { name: 'cSetCountPrivates' }),
  graphql(getRefGroups, { name: 'getRefGroups' }),
  graphql(setRefGroups, { name: 'setRefGroups' }),
)(LeftNav);

