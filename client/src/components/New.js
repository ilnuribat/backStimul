import React, { Component } from 'react'
import { graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import _ from 'lodash';
import { qauf, _url } from '../constants'
import 'animate.css';
import { getPrivateChat, user, group, selectUser, allUsers } from '../graph/querys';
import FirstLayout from './Layout';
import ChatPrivate from './ChatPrivate';


var colorHash = new ColorHash({lightness: 0.7, hue: 0.8});

class GroupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      allusers: [],

    }
    this.loadg = this.loadg.bind(this)
    this.loadu = this.loadu.bind(this)
    this.allUserGet = this.allUserGet.bind(this)
    this.userAdd = this.userAdd.bind(this)
  }

  componentDidMount(){
    const {getPrivateChat} = this.props
    let _grid = getPrivateChat.currentGroup || localStorage.getItem('grid');

    this.loadg()
    this.loadu(_grid)
    this.allUserGet()
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

  render() {
    const {users, _grid, allusers} = this.state;
    const {getPrivateChat} = this.props;

    let onlyunicusers = _.differenceWith(allusers, users, _.isEqual);


    if(getPrivateChat.currentGroup !== _grid){
      this.loadu(getPrivateChat.currentGroup)
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
