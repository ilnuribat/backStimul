import React, { Component } from 'react';
import { graphql, compose, Query  } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { qauf, _url, colorHash } from '../constants';
import 'animate.css';
import { getPrivateChat, user, group, selectUser, allUsers, glossaryStatus, groupMut, getCUser } from '../graph/querys';
import FirstLayout from './Layout';
import ChatPrivate from './ChatPrivate';
import Loading from './Loading';
import Modal from './TaskParts/Modal';
import ChangerForm from './TaskParts/ChangerForm';

let usernameAss, statusName;

class GroupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      allusers: [],
      status: [],
      input: {},
      groupName: "",
      groupId: "",
      groupInfo: {},
      modal: false,
      inputSaver: {},
    }

    this.loadg = this.loadg.bind(this);
    this.loadu = this.loadu.bind(this);
    this.allUserGet = this.allUserGet.bind(this);
    this.userAdd = this.userAdd.bind(this);
    this.glossStatus = this.glossStatus.bind(this);
    this.onStatSelected = this.onStatSelected.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.inputSave = this.inputSave.bind(this);
  }

  componentDidMount(){
    const {getPrivateChat} = this.props
    let _grid = getPrivateChat.id || localStorage.getItem('grid');

    this.setState({
      groupName: getPrivateChat.name,
      groupId: getPrivateChat.id,
    });

    this.loadg();
    this.loadu(_grid);
    this.allUserGet();
    this.glossStatus();
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
        });
      }
    })
      .then(
        ()=>{
          if(this.state.groupInfo.assignedTo){
            usernameAss = _.find(this.state.groupInfo.users, (obj)=> { return obj.id === this.state.groupInfo.assignedTo; })
          }else{
            usernameAss = {name: "Не назначен"};
          }
        }
      )
      .catch((e)=>{
        console.warn(e);
      });

  }

  userSelect(n,i){
    const {selectUser} = this.props;

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
        status: [" ",...a.data.glossary.taskStatuses]
      });
      console.log(a)
      console.log(this.state.status)
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  onStatSelected(e){

    qauf(groupMut(this.props.getPrivateChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }

  onUserSelected(e){

    qauf(groupMut(this.props.getPrivateChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }
  inputSave(){

  }

  inputChange(e){

  }

  render() {
    const {users, _grid, allusers, groupName, groupInfo, modal, status} = this.state;
    const {getPrivateChat, getCUser} = this.props;

    let onlyunicusers = _.differenceWith(allusers, users, _.isEqual);

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
                        onlyunicusers && onlyunicusers.length > 0 ? onlyunicusers.map((e,i)=>{
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
                  <div className="header"></div>
                  <div className="content">
                    <div className="button" onClick={()=>{this.setState({modal: !modal})}}>Редактировать</div>
                    <div className="content-scroll">
                    </div>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>

        {modal ? (
          <Modal header="Редактирование Задачи" body="Текст" close={()=>{ this.setState({modal: !modal})}}>
            <div className="overWrap">
              <div>
                {  statusName = _.result(_.find(status, (obj)=> {
                  return obj.id === groupInfo.status;
                }), 'name')
                }

                <ChangerForm id={getPrivateChat.id} defaults={groupName} name={"Название"} change={"name"} string={1} />
                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.endDate} defaultText={groupInfo.endDate?groupInfo.endDate:"Не указано"} name={"Дата Завершения"} change={"endDate"} type={"date"} string={1} />
                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.status < 1 ? 1 : groupInfo.status} name={"Статус"} change={"status"} type={"text"} string={0} select={1} options={status} defaultText={status[groupInfo.status < 1 ? 1 : groupInfo.status ]} />
                <ChangerForm id={getPrivateChat.id} defaults={groupInfo.assignedTo} name={"Ответсвенный"} change={"assignedTo"} type={"text"} string={1} select={1} options={users} defaultText={usernameAss ? usernameAss : {name: "Не назначен"} } />

              </div>
            </div>
          </ Modal>
        ) : null

        }

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
  graphql(getCUser, { name: 'getCUser' }),
)(GroupList);
