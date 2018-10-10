import React, { Component } from 'react'
import { graphql, compose, Query  } from "react-apollo";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import _ from 'lodash';
import { qauf, _url } from '../constants'
import 'animate.css';
import { getPrivateChat, user, group, selectUser, allUsers, GroupBid, glossaryStatus, groupMut } from '../graph/querys';
import FirstLayout from './Layout';
import ChatPrivate from './ChatPrivate';
import Loading from './Loading';


var colorHash = new ColorHash({lightness: 0.7, hue: 0.8});

class GroupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      allusers: [],
      status: [],
      input: "",
      groupName: "",
      groupId: "",
      groupInfo: {},
    }

    this.loadg = this.loadg.bind(this)
    this.loadu = this.loadu.bind(this)
    this.allUserGet = this.allUserGet.bind(this)
    this.userAdd = this.userAdd.bind(this)
    this.glossStatus = this.glossStatus.bind(this)
    this.onStatSelected = this.onStatSelected.bind(this)
    this.inputChange = this.inputChange.bind(this)
  }

  componentDidMount(){
    const {getPrivateChat} = this.props
    let _grid = getPrivateChat.id || localStorage.getItem('grid');

    this.setState({
      groupName: getPrivateChat.name,
      groupId: getPrivateChat.id,
    })

    this.loadg()
    this.loadu(_grid)
    this.allUserGet()
    this.glossStatus()
  }

  changeState(a){

  }

  changeGrUsers(a){
    this.setState({
      users: [...a],
    })
  }

  allUserGet(){
    qauf(allUsers(), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        this.setState({
          allusers: a.data.users
        })
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  loadg(){
    qauf(user(localStorage.getItem('userid')), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data.user.groups){
        this.changeState(a.data.user.groups);
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  loadu(g){
    const {users} = this.state;

    qauf(group(g), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data.group.users && a.data.group.users.length !== users.length){

        this.changeGrUsers(a.data.group.users);
        this.setState({
          groupName: a.data.group.name,
          groupInfo: a.data.group,
        })
      }
    }).catch((e)=>{
      console.warn(e);
    });

  }

  userSelect(n,i){
    const {selectUser} = this.props

    selectUser({
      variables: { userName: n, userId: i }
    })
  }

  userAdd(i){

    let q = () => {return(`mutation{
      updateUsersGroup(group: {id: "${this.props.getPrivateChat.id}", users: ["${i}"]} )
    }`)} ;

    qauf(q(), _url, localStorage.getItem('auth-token')).then(a=>{
    })
      .then(()=>{
        this.loadu(this.props.getPrivateChat.id)
      })
      .catch((e)=>{
        console.warn(e);
      });
  }

  glossStatus(){

    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{

      this.setState({
        status: a.data.glossary.taskStatuses
      });
      console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });
  }
  onStatSelected(e){

    console.log(e.target.value)

    qauf(groupMut(this.props.getPrivateChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.log(a)
    })
    .catch((e)=>{
      console.warn(e);
    });

  }
  inputChange(e){
    let a = this.state.groupName;
    let b = e.target.value;
    this.setState({
      groupName: b,
    })

    // console.log(e.target.value)
    // qauf(groupMut(this.props.getPrivateChat.id, `name: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
    //   console.log(a)
    // })
    // .catch((e)=>{
    //   console.warn(e);
    // });

  }

  render() {
    const {users, _grid, allusers, groupName, groupInfo} = this.state;
    const {getPrivateChat} = this.props;

    let onlyunicusers = _.differenceWith(allusers, users, _.isEqual);

    console.log("groupName",groupInfo)


    if(getPrivateChat.id !== _grid){
      this.loadu(getPrivateChat.id)
    }

    return(
      <FirstLayout barstate="chat">
        <div className="f-container">
          <div className="f-column">
            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? <ChatPrivate name={this.props.getPrivateChat.name} id={this.props.getPrivateChat.id} priv={0} /> : (<div className="errorMessage">Выберите чат</div>)
            }
          </div>
          <div className="f-column">

            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? (
                <div className="tab-roll">
                  <div className="header"><h4>Выберите пользователя</h4></div>
                  <div className="content">
                    <div className="content-scroll">
                      {
                        users.map(
                          (e,i,a)=>{
                            return(
                              <option name={e.id} value={e.id}>{e.username}
                                {e.username}
                              </option>
                            )
                          }
                        )
                      }
                    </div>
                  </div>
                </div>
              ): null
            }

            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? (
                <div className="tab-roll">
                  <div className="header"><h4>Добавить пользователя</h4></div>
                  <div className="content">
                    <div className="content-scroll">
                      {
                        onlyunicusers && onlyunicusers.length > 0 ? onlyunicusers.map((e,i,a)=>{
                          return(
                            <div className="username" role="presentation" style={{color: colorHash.hex(e.username)}} key={'usr-'+i} onClick={()=>this.userAdd(e.id)}>
                              {e.username}
                              {' '}
                              {localStorage.getItem('userid') === e.id ? (<span className="me"> - это я</span>) : null }
                              {' '}
                            </div>
                          )
                        }) : ("Нет юзеров")
                      }
                    </div>
                  </div>
                </div>
              ) : null
            }
            {
              this.props.getPrivateChat && this.props.getPrivateChat.id ? (
                <div className="tab-roll">
                  <div className="header"><h4>Редактировать</h4></div>
                  <div className="content">
                    <div className="content-scroll">
                      <div className="overWrap">
                                <div>
                                  <label htmlFor="grname">Изменить название</label>
                                  <input name="grname" type="text" value={groupName} onChange={this.inputChange}/>
                                </div>
                                {groupInfo.endDate}




                                <div>
                                  <select name="status" onChange={this.onStatSelected}>
                                    {
                                      users.map(
                                        (e,i,a)=>{
                                          return(
                                            <div className="username" role="presentation" style={{color: colorHash.hex(e.username)}} key={'usr-'+i} onClick={()=>this.userSelect(e.username, e.id)}>
                                              {e.username}
                                              {' '}
                                              {localStorage.getItem('userid') === e.id ? (<span className="me"> - это я</span>) : '' }
                                              {' '}
                                            </div>
                                          )
                                        }
                                      )
                                    }
                                  </select>
                                </div>
                                {groupInfo.assignedTo}
                                <div>
                                  <label htmlFor="status">Изменить статус</label>
                                  <select name="status" onChange={this.onStatSelected}>
                                    {
                                      this.state.status.map((e,i)=>{
                                        return(
                                          <option key={"status"+e.id} value={e.id}>
                                            {e.name}
                                          </option>
                                        )
                                      })
                                    }
                                  </select>
                                </div>
                              </div>
                      {/* <Query query={GroupBid} variables={{id: this.props.getPrivateChat.id}} >
                        {({ loading, error, data }) => {
                          if (loading) return <Loading />;
                          if (error) return `Error! ${error.message}`;

                          console.log(data)

                          return (
                          );
                        }}
                      </Query> */}
                    </div>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
      </FirstLayout>
    );
  }
}


GroupList.propTypes = {
  getPrivateChat: PropTypes.shape({
    id: PropTypes.string,
    name:  PropTypes.string,
  }).isRequired,
  selectUser: PropTypes.func.isRequired
};

export default compose(
  graphql(getPrivateChat, { name: 'getPrivateChat' }),
  graphql(selectUser, { name: 'selectUser' }),
)(GroupList);
