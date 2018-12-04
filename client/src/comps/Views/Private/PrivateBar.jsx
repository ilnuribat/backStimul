import React from 'react';
import { graphql, compose, Query  } from "react-apollo";
import _ from 'lodash';
import PropTypes from 'prop-types';

import moment from 'moment';
import { getChat, cSetCountPrivates, chatListCacheUpdate } from '../../../GraphQL/Cache';
import { qauf, _url } from '../../../constants';
import Loading from '../../Loading';
import { USERS_QUERY, CHATS_QUERY } from '../../../GraphQL/Qur/Query';
// import { MESSAGE_CREATED } from '../../../GraphQL/Qur/Subscr';
import { createDirect } from '../../../GraphQL/Qur/Mutation';
import { UserRow } from '../../Parts/Rows/Rows';
import Svg from '../../Parts/SVG/svg';


class PrivateBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chatId: "",
      newUser: "",
      newChay: "",
      userwarn: "",
      warnMe: "",
      tasksOpen: true,
      privsOpen: false,
    }

    this.newUser = this.newUser.bind(this);
    this.tasksOpen = this.tasksOpen.bind(this);
    this.privsOpen1 = this.privsOpen1.bind(this);
    this.CreateNewGroup = this.CreateNewGroup.bind(this);
  }

  openPrivate(gid, privateChat){
    this.props.click(gid, privateChat)

    this.props.chatListCacheUpdate({
      variables:{
        value: {groupId: gid, reset: true},
        queryName: privateChat ? "directs" : "tasks"
      }
    })
  }

  newUser(e,users){

    if(e && e.target && e.target.value){
      let user = _.find(users, (obj)=> { return obj.username === e.target.value; });

      if(user && user.id){
        this.setState({
          newUser: e.target.value,
          newUserId: user.id,
        })
      }else{
        console.warn("Неправильный юзер", user);
      }

    }

  }

  CreateNewGroup(users, nodeInput){
    let uid = "";
    let {newUser} = this.state;

    if(users){
      let user = _.find(users, (obj)=> { return obj.username === newUser; });

      if(user){
        uid = user.id;
        // console.warn("юзер", nodeInput);
        nodeInput.value = ""
      }else{
        console.warn("Неправильный юзер");
        this.setState({
          newUser:"",
        })
        nodeInput.value = ""
      }
    }

    let params = `"${uid}"`;

    if(uid){
      qauf(createDirect(params), _url, localStorage.getItem('auth-token')).then(a=>{
        if(a && a.data){
          // ref1()
          this.props.chatListCacheUpdate({
            variables:{
              value: {id: a.data.directMessage.id, name: newUser, addUser: true},
              queryName: "directs"
            }
          })
        }
      }).catch((e)=>{
        console.warn(e);
      });
    }else{
      return(false)
    }

  }

  timeEdit(time){
    if(time){

      let a = '';
      let dif = moment(  moment(moment()).format('YYYY MM D, h:mm:ss')  ).diff(   moment(time).format(' YYYY MM D, h:mm:ss')    ) / 3600000 ;

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

  // setBlogPostViewsAsync = async () => {
  //   this.setState({ privsOpen: !this.state.privsOpen }, () => Promise.resolve());
  // }

  privsOpen1(){
    this.setState({
      privsOpen: !this.state.privsOpen
    })
  }

  tasksOpen(){
    // console.warn("tasksOpen");
    this.setState({
      tasksOpen: !this.state.tasksOpen
    })
  }

  // shouldComponentUpdate(nextProp, nextState) {
  //   if (!_.isEqual(nextProp.getPrivateChat.id, this.props.getPrivateChat.id)) return true

  //   return true
  // }

  render(){
    let newChay;
    const { chatId } = this.props;
    let { tasksOpen, privsOpen } = this.state;

    return (
      <div className="f-column-l">
        <div className="tab-roll">
          <div className="content">
            <div className="content-scroll">

              <Query query={CHATS_QUERY}>
                {({ loading, error, data}) => {
                  // ref1 = refetch;
                  if (loading){
                    return (
                      <div style={{ paddingTop: 20 }}>
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

                  if(data && data.user){
                    let privs = 0;

                    return(
                      <div className="Chats">
                        <div className="Row Header" onClick={this.tasksOpen}>
                          <h4>Беседы задач</h4>
                        </div>
                        <div className="ChatsScroll">
                          { tasksOpen ? (<div className="ChatsInner">
                            {
                              data.user.tasks && data.user.tasks.map((e,i, a)=>{
                              //Если не открытый чат
                                if (chatId !== e.id ) {
                                  privs = privs + e.unreadCount;
                                // subscrMes(subscribeToMore, e.id, refetch)
                                }
                                if (i === a.length-1) {
                                  this.props.cSetCountPrivates({
                                    variables: { unr: privs }
                                  });
                                }

                                let sel = "";

                                chatId === e.id ? sel = " SEL" :  sel = "";

                                return(
                                  <div className={"Row" + sel} key={'users-'+i} onClick={()=>this.openPrivate(e.id, false)}>
                                    {/* <div>{e.id}</div> */}

                                    <UserRow key={'users-'+i} size="42" icon="1" id={e.id} name={e.name ? e.name.length > 70 ? e.name.substring(0, 70) + "..." : e.name : "noname" } >
                                      {e.lastMessage && e.lastMessage.text ? (

                                        <div className="RowChildren PadTop5">
                                          <div className="col">
                                            {e.lastMessage.from && e.lastMessage.from.username  ? <div className="UserNameText">{e.lastMessage.from.username}</div> : null}
                                            <div className="MessageSimpleText">"{e.lastMessage.text}"</div>
                                          </div>
                                          <div className="col">
                                            {e.lastMessage.createdAt ? (<div className="MessageSimpleText Row3">
                                              {/* {e.lastMessage.isRead ? <Svg svg="read" size="16" view="inline MR5"/> : null} */}
                                              {this.timeEdit(e.lastMessage.createdAt)}</div>) : null }
                                          </div>


                                        </div>
                                      ) : null}
                                    </UserRow>

                                    {e.unreadCount && this.props.getChat.id !== e.id  ? (<span className="maxiCounter">{e.unreadCount}</span>) : null}
                                  </div>

                                )
                              })
                            }
                          </div>) : null}
                        </div>
                        <div className="Row Header" onClick={this.privsOpen1}>
                          <h4>Личные беседы</h4>
                        </div>
                        <div className="ChatsScroll">
                          { privsOpen ? (<div className="ChatsInner">
                            {
                              data.user.directs && data.user.directs.map((e, i, a)=>{
                                //Если не открытый чат
                                if (chatId !== e.id ) {
                                  privs = privs + e.unreadCount;
                                  // subscrMes(subscribeToMore, e.id, refetch)
                                }
                                if (i === a.length-1) {
                                  this.props.cSetCountPrivates({
                                    variables: { unr: privs }
                                  });
                                }

                                let sel = "";

                                chatId === e.id ? sel = " SEL" :  sel = "";

                                return(
                                  <div className={"Row" + sel} key={'users-'+i} onClick={()=>this.openPrivate(e.id, true)}>
                                    {/* <div>{e.id}</div> */}

                                    <UserRow key={'users-'+i} size="42" icon="1" id={e.id} name={e.name ? e.name.length > 70 ? e.name.substring(0, 70) + "..." : e.name : "noname" } >
                                      {e.lastMessage && e.lastMessage.text ? (

                                        <div className="RowChildren PadTop5">
                                          <div className="col">
                                            {e.lastMessage.from && e.lastMessage.from.username  ? <div className="UserNameText">{e.lastMessage.from.username}</div> : null}
                                            <div className="MessageSimpleText">"{e.lastMessage.text}"</div>
                                          </div>
                                          <div className="col">
                                            {e.lastMessage.createdAt ? (<div className="MessageSimpleText Row3">
                                              {/* {e.lastMessage.isRead ? <Svg svg="read" size="16" view="inline MR5"/> : null} */}
                                              {this.timeEdit(e.lastMessage.createdAt)}</div>) : null }
                                          </div>


                                        </div>
                                      ) : null}
                                    </UserRow>

                                    {e.unreadCount && this.props.getChat.id !== e.id  ? (<span className="maxiCounter">{e.unreadCount}</span>) : null}
                                  </div>

                                )
                              })
                            }
                          </div>) : null}
                        </div>

                      </div>
                    )

                  }
                  else{
                    return(
                      <div className="errorMessage" >Нет данных</div>
                    )
                  }

                }}
              </Query>
            </div>
          </div>
        </div>
        <div className="tab-roll">
          <div className="header">
            <h4>Добавить личный чат</h4>
          </div>
          {
            <Query query={USERS_QUERY}>
              {({ loading, data }) => {
                if (loading){
                  return (
                    <div style={{ paddingTop: 20 }}>
                      <Loading />
                    </div>
                  );
                }

                if(data && data.users){
                  return(

                    <label className="LabelInputList Pad" htmlFor="users">
                      <input ref={node=>{newChay = node}} type="list" name="users" list="users" autoComplete="on" valueid="" onChange={(e)=>this.newUser(e, data.users)} />
                      <div className="Button3" onClick={()=>this.CreateNewGroup(data.users, newChay)}>+</div>

                      <datalist id="users">
                        {
                          data.users && data.users.map((e)=>(
                            <option key={e.id} data-id={e.id} valueid={e.id} valuename={e.username} >{e.username}</option>
                          )
                          )
                        }
                      </datalist>
                    </label>
                  )
                }else{
                  return(
                    <div>Нет данных</div>
                  )
                }

              }}
            </Query>
          }
        </div>
      </div>
    )
  }
}


PrivateBar.propTypes = {
  setCountPriv: PropTypes.shape({
    unreaded: PropTypes.number,
    chats: PropTypes.array,
  }),
  cSetCountPrivates: PropTypes.func.isRequired,
  getChat: PropTypes.object.isRequired,
  chatListCacheUpdate: PropTypes.func.isRequired
};

export default compose(
  graphql(cSetCountPrivates, { name: 'cSetCountPrivates' }),
  graphql(chatListCacheUpdate, { name: 'chatListCacheUpdate' }),
  graphql(getChat, { name: 'getChat' }),
)(PrivateBar);
