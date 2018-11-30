import React from 'react';
import { graphql, compose, Query  } from "react-apollo";
import _ from 'lodash';
import PropTypes from 'prop-types';

import { setChat, getChat, cSetCountPrivates, cSetChats, privateListCacheUpdate } from '../../../GraphQL/Cache';
import { qauf, _url } from '../../../constants';
import Loading from '../../Loading';
import { PRIVS_QUERY, USERS_QUERY, cGetChats } from '../../../GraphQL/Qur/Query';
// import { MESSAGE_CREATED } from '../../../GraphQL/Qur/Subscr';
import { createDirect } from '../../../GraphQL/Qur/Mutation';
import { UserRow } from '../../Parts/Rows/Rows';


// let ref1;

// const subscrMes = (subscribeToMore,idu, refetch)=>{
//   return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: idu,},
//     updateQuery: () => {
//       refetch().then(()=>{
//       })
//     },
//   });
// };

class Private extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chatId: "",
      newUser: "",
      newChay: "",
      userwarn: "",
      warnMe: "",
    }
    this.newUser = this.newUser.bind(this);
    this.CreateNewGroup = this.CreateNewGroup.bind(this);
  }

  openPrivate(gid, name){
    // this.props.setPrivateChat({
    //   variables: { id: gid, name: name }
    // })

    this.props.click(gid)

    this.props.privateListCacheUpdate({
      variables:{
        value: {id: gid, reset: true}
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
          this.props.privateListCacheUpdate({
            variables:{
              value: {id: uid, name: newUser, addUser: true}
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

  shouldComponentUpdate(nextProp) {
    if (!_.isEqual(nextProp.getPrivateChat.id, this.props.getPrivateChat.id)) return true
    else return false
  }

  render(){
    let newChay;
    const {chatId} = this.props;

    return (
      <div className="f-column-l">
        <div className="tab-roll">
          <div className="header">
            <h4>Личные чаты</h4>
          </div>
          <div className="content">
            <div className="content-scroll">

              <Query query={PRIVS_QUERY}>
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

                  if(data && data.user && data.user.directs){
                    let privs = 0;

                    return(
                      <div className="PrivateChatsUsers">{
                        data.user.directs.map((e,i, a)=>{
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

                          return(
                            <div className="RowBg Row" key={'users-'+i} onClick={()=>this.openPrivate(e.id)}>
                              {/* <div>{e.id}</div> */}
                              
                              <UserRow key={'users-'+i} size="42" icon="1" id={e.id} name={e.name} >
                                {e.lastMessage && e.lastMessage.text ? (
                                
                                <div className="RowChildren PadTop5">
                                  {e.lastMessage.from && e.lastMessage.from.username  ? <div className="UserNameText">{e.lastMessage.from.username}</div> : null}
                                  <div className="MessageSimpleText">"{e.lastMessage.text}"</div>
                                </div>
                                ) : null}
                              </UserRow>

                              {e.unreadCount && this.props.getPrivateChat.id !== e.id  ? (<span className="maxiCounter">{e.unreadCount}</span>) : null}
                            </div>

                          )
                        })
                      }</div>
                    )

                  }else{
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


Private.propTypes = {
  setCountPriv: PropTypes.shape({
    unreaded: PropTypes.number,
    chats: PropTypes.array,
  }),
  cSetCountPrivates: PropTypes.func.isRequired,
  getPrivateChat: PropTypes.object.isRequired,
  setPrivateChat: PropTypes.func.isRequired,
  privateListCacheUpdate: PropTypes.func.isRequired
};

export default compose(
  graphql(cSetCountPrivates, { name: 'cSetCountPrivates' }),
  graphql(privateListCacheUpdate, { name: 'privateListCacheUpdate' }),
  graphql(cSetChats, { name: 'cSetChats' }),
  graphql(cGetChats, { name: 'cGetChats' }),
  graphql(getChat, { name: 'getPrivateChat' }),
  graphql(setChat, { name: 'setPrivateChat' }),
)(Private);
