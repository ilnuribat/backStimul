import React, { Component } from 'react'
import { graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import _ from 'lodash';
import { qauf, _url } from '../constants'
import 'animate.css';
import { showCurrentGroup, user, group, selectUser, allUsers } from '../graph/querys';
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
    const {showCurrentGroup} = this.props
    let _grid = showCurrentGroup.currentGroup || localStorage.getItem('grid');

    // let _grnm = this.props.showCurrentGroup.groupName || '';
    this.loadg()
    this.loadu(_grid)
    this.allUserGet()
    // this.setState({
    //   grid: _grid,
    //   grnm: _grnm,
    //   gid: _grid,
    // })

  }

  changeState(a){
    // let groupList = this.state.groupList;
    // let arr = groupList.concat(...a);

    // this.setState({
    //   // groupList: [...groupList, ...a]
    //   grl: [...a],
    // })

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

    // let q = () => {return(`mutation{
    //   updateGroup(id: "${this.props.showCurrentGroup.currentGroup}", group: {userIds: ["${i}"]} )
    // }`)} ;

    let q = () => {return(`mutation{
      updateUsersGroup(group: {id: "${this.props.showCurrentGroup.currentGroup}", users: ["${i}"]} )
    }`)} ;

    qauf(q(), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
      }
    })
    .then(()=>{
      this.loadu(this.props.showCurrentGroup.currentGroup)
    })
    .catch((e)=>{
      console.warn(e);
    });
  }

  render() {
    const {users, _grid, allusers} = this.state;
    const {showCurrentGroup} = this.props;

    let onlyunicusers = _.differenceWith(allusers, users, _.isEqual);


    if(showCurrentGroup.currentGroup !== _grid){
      this.loadu(showCurrentGroup.currentGroup)
    }

    return(
      <FirstLayout barstate="chat">
        <div className="f-container">
          <div className="f-column">
          {
            this.props.showCurrentGroup && this.props.showCurrentGroup.currentGroup ? <ChatPrivate name={this.props.showCurrentGroup.groupName} id={this.props.showCurrentGroup.currentGroup} priv={0} /> : (<div className="errorMessage">Выберите чат</div>)
          }
          </div>
          <div className="f-column">

          {
            this.props.showCurrentGroup && this.props.showCurrentGroup.currentGroup ? (
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
                this.props.showCurrentGroup && this.props.showCurrentGroup.currentGroup ? (
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
  showCurrentGroup: PropTypes.shape({
    currentGroup: PropTypes.string
  }).isRequired,
  selectUser: PropTypes.func.isRequired
};

export default compose(
  graphql(showCurrentGroup, { name: 'showCurrentGroup' }),
  graphql(selectUser, { name: 'selectUser' }),
)(GroupList);
