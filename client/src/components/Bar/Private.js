import React from 'react';
import { graphql, compose, Query  } from "react-apollo";
import ColorHash from 'color-hash';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getPrivateChat, setPrivateChat, createDirect, PRIVS_QUERY, USERS_QUERY, MESSAGE_CREATED, cSetCountPrivates, cSetChats, cGetChats } from '../../graph/querys';
import { qauf, _url, colorHash } from '../../constants';
import Loading from '../Loading';


let ref1;

const subscrMes = (subscribeToMore,idu, refetch)=>{
  return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: idu,},
    updateQuery: () => {
      refetch().then(()=>{
      })
    },
  });
};

class Private extends React.Component {
  openPrivate(gid, name){
    // console.warn (gid, name)

    this.props.setPrivateChat({
      variables: { id: gid, name: name }
    })
    ref1();
  }


  CreateNewGroup(uid){
    let params = `"${uid}"`;
    console.log(createDirect(params));
    qauf(createDirect(params), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        ref1()
        console.log(a);
        
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  shouldComponentUpdate(nextProp) {
    // Use lodash is Equal nextProp, nextState
    // console.warn("getPrivateChat", _.isEqual(nextProp.getPrivateChat, this.props.getPrivateChat));
    // console.warn("getPrivateChats", nextProp.getPrivateChat, this.props.getPrivateChat);
    if (!_.isEqual(nextProp.getPrivateChat.id, this.props.getPrivateChat.id)) return true
    else return false
  }

  render(){

    // console.warn ("REFRESH!!")

    return (
      <div className="f-column-l">
        <div className="tab-roll">
          <div className="header">
            <h4>Мои чаты</h4>
          </div>
          <div className="content">
            <div className="content-scroll">

              <Query query={PRIVS_QUERY}>
                {({ loading, error, data, refetch, subscribeToMore }) => {
                  ref1 = refetch;
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
                      <div>{
                        data.user.directs.map((e,i, a)=>{
                          //Если не открытый чат
                          if (this.props.getPrivateChat.id !== e.id ) {
                            privs = privs + e.unreadCount;
                            subscrMes(subscribeToMore, e.id, refetch)
                          }
                          if (i === a.length-1) {
                            this.props.cSetCountPrivates({
                              variables: { unr: privs }
                            });
                          }

                          return(
                            <div className="user-private-chat" ids={e.id} key={'users-'+i} onClick={()=>this.openPrivate(e.id, e.name)}>
                              {e.name}
                              {e.unreadCount && this.props.getPrivateChat.id !== e.id  ? (<span className="small-ruond-info">{e.unreadCount}</span>) : null}
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
            <h4>Создать приватный чай</h4>
          </div>
          <div className="content">
            <div className="content-scroll">
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
                        <div>{
                          data.users.map((e,i)=>{
                            let Iam;

                            if(e.id === localStorage.getItem('userid')){
                              Iam = ' - я';

                              return <span style={{color: colorHash.hex(e.username)}}  key={'usersspan-'+i} >{e.username}<span>{Iam}</span></span>;
                            }

                            return(
                              <div className="user-private" key={'users-'+i} onClick={()=>this.CreateNewGroup(e.id,e.username)}>
                                <span style={{color: colorHash.hex(e.username)}}>{e.username}<span>{Iam}</span></span>
                              </div>
                            )
                          })
                        }</div>
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
  setPrivateChat: PropTypes.func.isRequired
};

export default compose(
  graphql(cSetCountPrivates, { name: 'cSetCountPrivates' }),
  graphql(cSetChats, { name: 'cSetChats' }),
  graphql(cGetChats, { name: 'cGetChats' }),
  graphql(getPrivateChat, { name: 'getPrivateChat' }),
  graphql(setPrivateChat, { name: 'setPrivateChat' }),
)(Private);
