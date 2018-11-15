import React, { Component, Fragment } from 'react';
import { graphql, compose, Query, Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
// import Autocomplete from 'react-toolbox/lib/autocomplete';
// import belle from 'belle';


import { qauf, _url, colorHash } from '../../../constants';
import 'animate.css';
import ChatView from '../ChatView/ChatView';
import Loading from '../../Loading';
import ChangerForm from './ChangerForm';
import { uploadFile, groupMut, updTask } from '../../../GraphQL/Qur/Mutation';
import { selectUser, tempObj, setTemp, getTemp, setChat } from '../../../GraphQL/Cache';
import { allUsers, glossaryStatus, GRU_QUERY, GR_QUERY,  getObjectTasks3 } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
// import Bar from '../../Lays/Bar/index';
import Panel from '../../Lays/Panel/index';
import Modal from '../../Lays/Modal';
import Modal2 from './Modal';
import '../../../newcss/taskview.css'

class TaskView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allTasks:[],
      allusers: [],
      status: [],
      input: {},
      taskName: "",
      taskId: "",
      objectId: "",
      taskInfo: {},
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
    this.newUser = this.newUser.bind(this);
    this.newAddress = this.newAddress.bind(this);
    this.addressAdd = this.addressAdd.bind(this);
  }

  componentDidMount(){

    const { location } = this.props;

    let _grid
    let _grnm
    let _objId

    this.props.setTemp({
      variables:{
        tempObj:  {stingh: "sa"},
      }
    });

    if (location.state && location.state.taskId) {
      _grid = location.state.taskId
      _grnm = location.state.taskName
      _objId = location.state.objectId
    } else {
      _grid = localStorage.getItem('grid');
      _grnm = localStorage.getItem('grnm');
      _objId = localStorage.getItem('ObjectId');
    }

    if(_grid && _grnm){
      this.props.setChat({
        variables:{
          id: localStorage.getItem('grid'),
          name: localStorage.getItem('grnm'),
        }
      })
      this.setState({
        taskName: _grnm,
        taskId: _grid,
        objectId: _objId
      });
    }

    this.allUserGet();
    this.glossStatus();

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


  getTaskLists(){
    // console.warn("GETTASK!!", objectId, taskId)
    const { objectId, taskId } = this.state

    qauf(getObjectTasks3(objectId), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        a.data.object.tasks = a.data.object.tasks.filter((task) => (task.parentId !== taskId && task.id !== taskId ))
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

  onStatSelected(e){

    qauf(groupMut(this.state.taskId, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }

  onUserSelected(e){

    qauf(groupMut(this.state.taskId, `status: ${e.target.value}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });

  }

  changeState(a){
    return false;
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
      updateUsersGroup(group: {id: "${this.state.taskId}", delete: ${dels}, users: ["${userId}"]} )
    }`)} ;


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

  addressAdd(address){
    let param = `address: "${address}"`;
    const A = groupMut(this.state.taskId, `${param}`);

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

  render() {
    const {upload, allusers, taskName, taskId, taskInfo, modal, status, allTasks } = this.state;
    let onlyunicusers;

    return(
      <Fragment>
        {/* <Bar></Bar> */}
        <Query
          query={GR_QUERY}
          variables={{ id: `${taskId}` }}
        >
          {({ data }) =>{
            console.warn("DATA", data)

            return(
              <Content>
                <div className="TaskView">
                  <div className="TaskViewInner">
                    {
                      taskId ? <ChatView name={taskName} id={taskId} priv={0} /> : (<div className="errorMessage">Выберите чат</div>)
                    }
                  </div>
                </div>
                {modal ? (
                  <Modal close={()=>{ this.setState({modal: !modal}) }} taskInfo={ data.task } taskId={ taskId } taskList={ allTasks }/>
                  // <Modal header="Подробная информация" body="Текст" close={()=>{ this.setState({modal: !modal})}} fullInfo="">
                  //   <div className="overWrap">
                  //     <div>
                  //       {  _.result(_.find(status, (obj)=> {
                  //         return obj.id === taskInfo.status;
                  //       }), 'name')
                  //       }

                //       <ChangerForm id={taskId} defaults={taskInfo.name} name={"Название"} change={"name"} string={1} />
                //       <ChangerForm id={taskId} defaults={taskInfo.endDate} defaultText={taskInfo.endDate?taskInfo.endDate:"Не указано"} name={"Дата Завершения"} change={"endDate"} type={"date"} string={1} />
                //       <ChangerForm id={taskId} defaults={taskInfo.status < 1 ? 1 : taskInfo.status} name={"Статус"} change={"status"} type={"text"} string={0} select={1} options={status} defaultText={status[taskInfo.status < 1 ? 1 : taskInfo.status ]} />
                //       <ChangerForm id={taskId} defaults={taskInfo.assignedTo && taskInfo.assignedTo.id ? taskInfo.assignedTo.id : null } name={"Ответственный"} change={"assignedTo"} type={"text"} string={1} select={1} options={users} defaultText={taskInfo.assignedTo && taskInfo.assignedTo.username ? {name: taskInfo.assignedTo.username}  : {name: "Не назначен"} } />

                //       <div className="padded">
                //         <select onChange={(e)=>{this.writeParentId(e, taskId)}}>
                //           <option value="0">Выбрать задачу</option>
                //           {
                //             this.state.allTasks.map((e,i)=>{
                //               return(
                //                 <option key={e.id} value={e.id}>{e.name}</option>
                //               )
                //             })
                //           }

                //         </select>
                //       </div>
                //     </div>
                //   </div>
                // </ Modal>
                ) : null

                }
              </Content>

            )}
          }
        </Query>
        <Panel>
          {
            taskId ? (
              <div className="tab-roll">
                <div className="header"><h4>Пользователи</h4></div>
                <div className="content">
                  <div className="content-scroll">

                    <Query query={GRU_QUERY} variables={{ id: taskId }} >
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
            taskId ? (
              <div className="tab-roll">
                <div className="header"></div>
                <div className="content">
                  <div className="button" onClick={()=>{this.setState({modal: !modal});this.getTaskLists()}}>Информация</div>
                  <div className="content-scroll">
                  </div>
                </div>
              </div>
            ) : null
          }
          {
            taskId? (
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
          {taskId ? (
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
                      <Dropzone onDrop={([file]) => {upload({ variables: { id: taskId, file } }).then(()=>this.setState({upload: !upload})).catch((err)=>console.warn(err));this.setState({upload: !upload}) }}>
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



TaskView.propTypes = {
  selectUser: PropTypes.func.isRequired
};

export default compose(
  graphql(setChat, { name: 'setChat' }),
  graphql(selectUser, { name: 'selectUser' }),
  graphql(tempObj, { name: 'tempObj' }),
  graphql(setTemp, { name: 'setTemp' }),
  graphql(getTemp, { name: 'getTemp' }),
)(TaskView);

const isArrayEqual = (x, y) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};
