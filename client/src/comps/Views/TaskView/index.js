import React, { Component, Fragment } from 'react';
import { graphql, compose, Query, Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
// import Autocomplete from 'react-toolbox/lib/autocomplete';
// import belle from 'belle';
import axios from 'axios';
import _ from 'lodash';

import { qauf, _url, colorHash } from '../../../constants';
import 'animate.css';
import ChatView from '../ChatView';
import Loading from '../../Loading';
import Modal from './Modal';
import ChangerForm from './ChangerForm';
import { uploadFile, groupMut, updTask } from '../../../GraphQL/Qur/Mutation';
import { getChat, selectUser, getCUser, tempObj, setTemp, getTemp, setChat, getObjectId } from '../../../GraphQL/Cache';
import { allUsers, glossaryStatus, GRU_QUERY, getObjectTasks3 } from '../../../GraphQL/Qur/Query';
import { userTaskUpdated } from '../../../GraphQL/Qur/Subscr';
import Content from '../../Lays/Content';
import Bar from '../../Lays/Bar/index';
import Panel from '../../Lays/Panel/index';
import '../../../newcss/taskview.css'

let statusName;

let subsUser = (id,subscribeToMore, refetch) =>{
  return subscribeToMore({
    document: userTaskUpdated,
    variables: { id: id },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newFeedItem = subscriptionData.data.commentAdded;

      refetch().then(()=>{
      });

    }
  });
};

class GroupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      allTasks:[],
      allusers: [],
      status: [],
      input: {},
      groupName: "",
      groupId: "",
      groupInfo: {},
      modal: false,
      inputSaver: {},
      newUser: "",
      newAddress: "",
      addressList: [],
      upload: false
    }

    this.allUserGet = this.allUserGet.bind(this);
    this.userAdd = this.userAdd.bind(this);
    this.glossStatus = this.glossStatus.bind(this);
    this.onStatSelected = this.onStatSelected.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.inputSave = this.inputSave.bind(this);
    this.newUser = this.newUser.bind(this);
    this.newAddress = this.newAddress.bind(this);
    this.addressAdd = this.addressAdd.bind(this);
  }

  componentDidMount(){

    let obj = {name:'name'};
    let arr = [].push(obj);

    this.props.setTemp({
      variables:{
        tempObj:  {stingh: "sa"},
      }
    });

    const {getChat, getCUser} = this.props;
    const { users } = this.state;
    let _grid = getChat.id || localStorage.getItem('grid');
    let _grnm = getChat.name || localStorage.getItem('grnm');

    if(localStorage.getItem('grid') && localStorage.getItem('grnm') && !getChat.id && !getChat.name){

      this.props.setChat({
        variables:{
          id: localStorage.getItem('grid'),
          name: localStorage.getItem('grnm'),
        }
      })
    }

    if(_grid && _grnm){
      this.setState({
        groupName: _grnm,
        groupId: _grid,
        _grid: _grid,
      });


    }
    this.allUserGet();
    this.glossStatus();

    if(getCUser.user  && getCUser.user.groups){
      let groups = getCUser.user.groups;
      let thisGrId = getChat.id || _grid;
      let thisUsers;

      thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

      this.setState({
        groupInfo: thisUsers,
      });

      if(thisUsers && thisUsers.users && users){
        var result1 = isArrayEqual(
          thisUsers.users,
          users
        );

        if( result1 ){
          return false;
        }else{
          this.setState({
            users: [...thisUsers.users],
          });

        }
      }else{
        return false;
      }
    }
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


  getTaskLists(objectId, taskId){
    // console.warn("GETTASK!!", objectId, taskId)
    !objectId ? objectId = localStorage.getItem('ObjectId') : null

    qauf(getObjectTasks3(objectId), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        a.data.object.tasks = a.data.object.tasks.filter((task) => (task.parentId != taskId && task.id != taskId ))
        this.setState({
          allTasks: a.data.object.tasks,
        })
      }
    }).catch((e)=>{
      console.warn(e);
    })
  }

  writeParentId(e, taskId) {
    // e.preventDefault();
    console.warn("writeParentId", e.target.value, taskId)
    qauf(updTask(taskId,`{parentId: "${e.target.value}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn(a)
    }).catch((e)=>{
      console.warn(e);
    })

  }


  changeState(a){
    return false;
  }

  changeGrUsers(a){
    this.setState({
      users: [...a],
    })
  }

  newUser(e){
    // console.log(e.target)
    this.setState({
      newUser: e.target.value,
    })
  }

  newAddress(e){
    this.setState({
      newAddress: e.target.value,
    })
  }

  loadu(g){

    const {users, _grid } = this.state;
    const {getChat, getCUser} = this.props;
    let thisUsers;

    if(_grid !== g ){
      this.setState({
        _grid: g,
      });
    }

    if(getCUser.user  && getCUser.user.groups){
      let groups = getCUser.user.groups;
      let thisGrId = getChat.id || _grid;

      thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

      this.setState({
        groupInfo: thisUsers,
      })
    }
  }

  userSelect(n,i){
    const {selectUser} = this.props;

    selectUser({
      variables: { userName: n, userId: i }
    })
  }

  userAdd(i,add){

    let {allusers} = this.state;
    let q;
    let dels = true;
    let userId = "";
    let id = i || this.state.newUser;

    if(add){
      dels = false;
      let user = _.find(allusers, (obj)=> { return obj.username === id; });

      if(user){
        // console.log(user);
        userId = user.id;

      }else{
        console.warn("Неправильный юзер");
      }
    }else{
      userId = id;
    }


    q = () => {return(`mutation{
      updateUsersGroup(group: {id: "${this.props.getChat.id}", delete: ${dels}, users: ["${userId}"]} )
    }`)} ;

    let a = q();

    if(typeof q === "function"){
      qauf(q(), _url, localStorage.getItem('auth-token')).then(a=>{
        // console.log("Answer updUsrGr",a)
      })
        .then(()=>{
          // this.loadu(this.props.getChat.id)
        })
        .catch((e)=>{
          console.warn(e);
        });
    }else{
      return false;
    }

  }

  async daDataReqId (id) {
    const res = await axios(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address',

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83"
        },
        data: {
          "query": id
        }
      })

    return res.data.suggestions[0].data;
  }

  async daDataReqIdPaid (address) {
    const res = await axios(
      'https://dadata.ru/api/v2/clean/address',

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83",
          // "X-Secret" : "53298fa2e7d1762e0e329388eb3fd66ae4a3312a"
        },
        data: [address]
      })

    return res.data.suggestions[0].data;
  }

  addressAdd(address, addressList){
    let param = `address: "${address}"`;
    const A = groupMut(this.props.getChat.id, `${param}`);

    qauf(A, _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn(a)
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
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  onStatSelected(e){

    qauf(groupMut(this.props.getChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }

  onUserSelected(e){

    qauf(groupMut(this.props.getChat.id, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }
  inputSave(){

  }

  inputChange(e){

  }

  componentDidUpdate(){

    const {getChat, getCUser} = this.props;
    const { users, groupInfo } = this.state;
    let _grid = getChat.id || localStorage.getItem('grid');

    if(getCUser.user  && getCUser.user.groups){
      let groups = getCUser.user.groups;
      let thisGrId = getChat.id || _grid;
      let thisUsers;

      thisUsers = _.find(groups, (o)=>{ return o.id == thisGrId; });

      if(JSON.stringify(groupInfo) !== JSON.stringify(thisUsers)){
        this.setState({
          groupInfo: thisUsers,
        });
      }

      if(thisUsers && thisUsers.users && users){

        var result1 = isArrayEqual(
          thisUsers.users,
          users
        );

        if( result1 ){
        }else{
          this.setState({
            users: [...thisUsers.users],
          });
        }
      }else{
      }



    }
  }

  render() {
    const {upload, users, _grid, allusers, groupName, groupInfo, modal, status, addressList} = this.state;
    const {getChat, getCUser, getTemp, getObjectId} = this.props;

    const idObject = getChat.id
    // let thisUsers;
    let onlyunicusers;

    return(
      <Fragment>
        {/* <Bar></Bar> */}
        <Content>
          <div className="TaskView">
            <div className="TaskViewInner">
              {
                this.props.getChat && this.props.getChat.id ? <ChatView name={this.props.getChat.name} id={this.props.getChat.id} priv={0} /> : (<div className="errorMessage">Выберите чат</div>)
              }
            </div>
          </div>
          {modal ? (
            <Modal header="Подробная информация" body="Текст" close={()=>{ this.setState({modal: !modal})}} fullInfo="">
              <div className="overWrap">
                <div>
                  {  statusName = _.result(_.find(status, (obj)=> {
                    return obj.id === groupInfo.status;
                  }), 'name')
                  }

                  <ChangerForm id={getChat.id} defaults={groupInfo.name} name={"Название"} change={"name"} string={1} />
                  <ChangerForm id={getChat.id} defaults={groupInfo.endDate} defaultText={groupInfo.endDate?groupInfo.endDate:"Не указано"} name={"Дата Завершения"} change={"endDate"} type={"date"} string={1} />
                  <ChangerForm id={getChat.id} defaults={groupInfo.status < 1 ? 1 : groupInfo.status} name={"Статус"} change={"status"} type={"text"} string={0} select={1} options={status} defaultText={status[groupInfo.status < 1 ? 1 : groupInfo.status ]} />
                  <ChangerForm id={getChat.id} defaults={groupInfo.assignedTo && groupInfo.assignedTo.id ? groupInfo.assignedTo.id : null } name={"Ответственный"} change={"assignedTo"} type={"text"} string={1} select={1} options={users} defaultText={groupInfo.assignedTo && groupInfo.assignedTo.username ? {name: groupInfo.assignedTo.username}  : {name: "Не назначен"} } />

                  <div className="padded">
                    <select onChange={(e)=>{this.writeParentId(e, idObject)}}>
                      <option value="0">Выбрать задачу</option>
                      {
                        this.state.allTasks.map((e,i)=>{
                          return(
                            <option key={e.id} value={e.id}>{e.name}</option>
                          )
                        })
                      }

                    </select>
                  </div>
                </div>
              </div>
            </ Modal>
          ) : null

          }
        </Content>
        <Panel>
          {
            this.props.getChat && this.props.getChat.id ? (
              <div className="tab-roll">
                <div className="header"><h4>Пользователи</h4></div>
                <div className="content">
                  <div className="content-scroll">

                    <Query query={GRU_QUERY} variables={{ id: getChat.id }} >
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
                            <div className="errMess">
                              {error.message}
                            </div>
                          );
                        }


                        subsUser(getChat.id, subscribeToMore, refetch);

                        if(data){
                          let usrs = data.group.users;

                          onlyunicusers = _.differenceWith(allusers, usrs, _.isEqual);

                          return(

                            data.group.users.map(
                              (e,i)=>{
                                return(
                                  <div className="username" role="presentation" key={'usr-'+i} >
                                    <div className="name" style={{color: colorHash.hex(e.username)}} >{e.username}{localStorage.getItem('userid') === e.id ? (<span className="me"> - это я</span>) : '' }</div>
                                    <div className="hoverTrigger">
                                      <div className="hover">
                                        <div className="btn v2" onClick={()=>this.userSelect(e.username, e.id)}>Написать {e.username}</div>
                                        <div className="btn v2" onClick={()=>this.userAdd(e.id)}>Удалить {e.username}</div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                            )
                          )

                        }

                        return true;
                      }}
                    </Query>
                  </div>
                </div>
              </div>
            ): null
          }
          {
            this.props.getChat && this.props.getChat.id ? (
              <div className="tab-roll">
                <div className="header"></div>
                <div className="content">
                  <div className="button" onClick={()=>{this.setState({modal: !modal});this.getTaskLists(getObjectId.currentObjectId ,idObject)}}>Информация</div>
                  <div className="content-scroll">
                  </div>
                </div>
              </div>
            ) : null
          }
          {
            this.props.getChat && this.props.getChat.id ? (
              <div className="tab-roll">
                <div className="header"><h4>Добавить пользователя</h4></div>
                <div className="content">
                  <div className="content-scroll">
                    <div>

                      <input type="list" list="users" autoComplete="on" onChange={this.newUser} />
                      {
                        this.state.newUser ? (
                          <div className="button" onClick={()=>this.userAdd(this.state.newUser, 1)}>Добавить {this.state.newUser}</div>
                        ): null
                      }

                      <datalist id="users">
                        {
                          onlyunicusers && onlyunicusers.length > 0 ? onlyunicusers.map((e,i)=>{
                            return(
                              <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                            )
                          }) : allusers.map((e,i)=>{
                            return(
                              <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                            )
                          })
                        }
                      </datalist>
                    </div>

                  </div>
                </div>
              </div>
            ) : null
          }
          {this.props.getChat && this.props.getChat.id ? (
            !upload ? (
              <div className="tab-roll">
                <div className="header"></div>
                <div className="content">
                  <div className="button" onClick={()=>{this.setState({upload: !upload})}}>Прикрепить файл</div>
                  <div className="content-scroll">
                  </div>
                </div>
              </div>
            ) : (
              <div className="tab-roll">
                <div className="header"></div>
                <div className="content">
                  <Mutation mutation={uploadFile}>
                    {upload => (
                      <Dropzone onDrop={([file]) => {upload({ variables: { id: idObject, file } }).then(()=>this.setState({upload: !upload})).catch((err)=>console.warn(err));this.setState({upload: !upload}) }}>
                        <p>Переместите сюда файлы или нажмите для добавления.</p>
                      </Dropzone>
                    )}

                  </Mutation>
                </div>
              </div>
            )
          ): null
          }
        </Panel>
      </Fragment>
    );
  }
}



GroupList.propTypes = {
  getChat: PropTypes.shape({
    id: PropTypes.string,
    name:  PropTypes.string,
  }).isRequired,
  selectUser: PropTypes.func.isRequired
};

export default compose(
  graphql(getChat, { name: 'getChat' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(selectUser, { name: 'selectUser' }),
  graphql(getCUser, { name: 'getCUser' }),
  graphql(tempObj, { name: 'tempObj' }),
  graphql(setTemp, { name: 'setTemp' }),
  graphql(getTemp, { name: 'getTemp' }),
  graphql(getObjectId, { name: 'getObjectId' }),
)(GroupList);

const isArrayEqual = (x, y) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};