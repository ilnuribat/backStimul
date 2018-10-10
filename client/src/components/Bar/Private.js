import React from 'react';
import { graphql, compose, Query  } from "react-apollo";
import ColorHash from 'color-hash';
import PropTypes from 'prop-types';
import { getPrivateChat, setPrivateChat, createDirect, PRIVS_QUERY, USERS_QUERY, MESSAGE_CREATED, cSetCountPrivates, cSetChats, cGetChats } from '../../graph/querys';
import { qauf, _url } from '../../constants';
import Loading from '../Loading';


var colorHash = new ColorHash({ saturation: 0.8, hue: 0.8 });

let ref1;
// let ref2;
// let gref;

const subscrMes = (subscribeToMore,idu, refetch)=>{
  return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: idu,},
    updateQuery: () => {
      refetch().then(()=>{
      })
    },
  });
};

// const subsToGroup = (id) => {
//   return (
//     <Query query={MESSAGE_CREATED} variables={{ id:id }}>
//       {({ loading, error, data, refetch, subscribeToMore }) => {
//         ref1 = refetch;
//         if (loading){
//           return (
//             <div style={{ paddingTop: 20 }}>
//               No Data
//             </div>
//           );
//         }
//         if (error) {
//           return (
//             <div style={{ paddingTop: 20 }}>
//               Error: {error.toString()}
//             </div>
//           )
//         }
//         if (data) {

//         }

//       }}


//     </Query>
//   )
// };


class Private extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [
        {id:"1",username:"Юзерь Ван"},
        {id:"2",username:"Юзерь Пач"},
        {id:"3",username:"Юзерь Ман"},
        {id:"4",username:"Юзерь 4"},
        {id:"5",username:"Юзерь 5"},

      ],
      chats:[],
      uid:'',
      gid:'',
      directs: '',
    }

    this.openPrivate = this.openPrivate.bind(this);
    this.CreateNewGroup = this.CreateNewGroup.bind(this);
  }


  openPrivate(gid, name){
    this.props.setPrivate({
      variables: { id: gid, name: name }
    })
  }


  CreateNewGroup(uid){

    let params = `"${uid}"`;

    qauf(createDirect(params), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        ref1()
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  render(){
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
                        data.user.directs.map((e,i,a)=>{

                          privs = privs + e.unreadCount;
                          this.props.setCountPriv({
                            variables: { unr: privs }
                          });


                          this.props.getchat.id !== e.id ? subscrMes(subscribeToMore,e.id, refetch) : null ;

                          return(
                            <div className="user-private-chat" ids={e.id} key={'users-'+i} onClick={()=>this.openPrivate(e.id, e.name)}>
                              {e.name}
                              {e.unreadCount && this.props.getchat.id !== e.id  ? (<span className="small-ruond-info">{e.unreadCount}</span>) : null}
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
                          data.users.map((e,i,a)=>{
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


// Private.propTypes = {
//   setCountPriv: PropTypes.shape({
//     unreaded: PropTypes.number,
//     chats: PropTypes.array,
//   }),
// };

export default compose(
  graphql(cSetCountPrivates, { name: 'setCountPriv' }),
  graphql(cSetChats, { name: 'cSetChats' }),
  graphql(cGetChats, { name: 'cGetChats' }),
  graphql(getPrivateChat, { name: 'getchat' }),
  graphql(setPrivateChat, { name: 'setPrivate' }),
)(Private);
