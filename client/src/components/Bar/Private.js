import React from 'react';
import { graphql, compose, Query  } from "react-apollo";
import { getPrivateChat, setPrivateChat, allUsers, privates, createDirect, PRIVS_QUERY, USERS_QUERY, MESSAGE_CREATED } from '../../graph/querys';
import { qauf, _url } from '../../constants';
import Loading from '../Loading';
import ColorHash from 'color-hash';

var colorHash = new ColorHash({ saturation: 0.8, hue: 0.8 });

let ref1;
let ref2;
let gref;

const subscrMes = (subscribeToMore,idu, refetch)=>{
  return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: idu,},
    updateQuery: () => {
      refetch().then(()=>{
      })
    },
  });
};

const subsToGroup = (id) => {
  return (
    <Query query={MESSAGE_CREATED} variables={{ id:id }}>
      {({ loading, error, data, refetch, subscribeToMore }) => {
        ref1 = refetch;
        if (loading){
          return (
            <div style={{ paddingTop: 20 }}>
              No Data
            </div>
          );
        }
        if (error) {
          return (
            <div style={{ paddingTop: 20 }}>
              Error: {error.toString()}
            </div>
          )
        }
        if (data) {

        }

      }}


    </Query>
  )
};


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

    this.newPrivate = this.newPrivate.bind(this);
    this.openPrivate = this.openPrivate.bind(this);
    this.CreateNewGroup = this.CreateNewGroup.bind(this);
    this.fetcher = this.fetcher.bind(this);
    this.allPrivates = this.allPrivates.bind(this);

  }


  newPrivate(uid,name){
    this.props.setPrivate({
      variables: { uid: uid, name: name }
    })
  }

  openPrivate(gid, name){
    this.props.setPrivate({
      variables: { id: gid, name: name }
    })
  }


  CreateNewGroup(uid, name){

    let params = `"${uid}"`;

    qauf(createDirect(params), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        ref1()
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  fetcher(){

  }

  allPrivates(){
    if(this.state.directs){
      this.state.directs.map((e,i,a)=>{
        return(
          <div className="user-private-chat" ids={e.id} key={'users-'+i} onClick={()=>this.openPrivate(e.id, e.name)}>
            {e.name}
            {e.messages && e.messages.edges.length ? (<span className="small-ruond-info">{e.messages.edges.length}</span>) : null}
          </div>
        )
      })
    }
  }


  componentDidMount(){

  }

  render(){
    let open = '';


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


                  if(data && data.user && data.user.directs){

                    return(
                      <div>{
                        data.user.directs.map((e,i,a)=>{
                          this.props.getchat.id != e.id ? subscrMes(subscribeToMore,e.id, refetch) : null ;

                          return(
                            <div className="user-private-chat" ids={e.id} key={'users-'+i} onClick={()=>this.openPrivate(e.id, e.name)}>
                              {e.name}
                              {e.unreadCount && this.props.getchat.id != e.id  ? (<span className="small-ruond-info">{e.unreadCount}</span>) : null}
                            </div>
                          )
                        })
                      }</div>
                    )
                  }else{
                    return(
                      <div className="errorMessage">Нет данных</div>
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
                  {({ loading, error, data, refetch, subscribeToMore }) => {
                    ref2 = refetch;
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
                            if(e.id == localStorage.getItem('userid')) return true;

                            return(
                              <div className="user-private" key={'users-'+i} onClick={()=>this.CreateNewGroup(e.id,e.username)}>
                                <span style={{color: colorHash.hex(e.username)}}>{e.username}</span>
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



export default compose(
  graphql(getPrivateChat, { name: 'getchat' }),
  graphql(setPrivateChat, { name: 'setPrivate' }),
)(Private);

