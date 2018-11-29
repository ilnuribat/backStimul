import React, { Component } from 'react';
import { graphql, compose, Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import axios from 'axios';
import 'animate.css';
import moment from 'moment';
// import momentRu from 'moment/locale/ru';
import { qauf, _url } from '../../../constants';
import { uploadFile, removeFile, updTask } from '../../../GraphQL/Qur/Mutation';
import { selectUser, taskCacheUpdate, objectCacheUpdate } from '../../../GraphQL/Cache';
import { allUsers, glossaryStatus, getObjectTasksSmall } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
// import Bar from '../../Lays/Bar/index';
// import Panel from '../../Lays/Panel/index';
import '../../../newcss/taskview.css'
import { UserRow, FileRow, ResponsibleRow } from '../../Parts/Rows/Rows';
import Modal, {InputWrapper, ModalRow, ModalCol, ModalBlockName} from '../../Lays/Modal/Modal';
// import Svg from '../../Parts/SVG'
import InnerBar from '../../Lays/InnerBar/InnerBar';

// import ContentInner from '../../Lays/ContentInner/ContentInner';
import { FakeSelect } from '../../Parts/FakeSelect/FakeSelect';
import Svg from '../../Parts/SVG';

moment.locale('ru')

class TaskView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allTasks:[],
      allusers: [],
      status: [],
      input: {},
      taskName: "",
      objectId: "",
      objectCache: false,
      modal: false,
      inputSaver: {},
      newUser: "",
      addressList: [],
      modalMessage:"",
      modalMessageShow:false,
    }

    this.allUserGet = this.allUserGet.bind(this);
    this.userAdd = this.userAdd.bind(this);
    this.glossStatus = this.glossStatus.bind(this);
    this.newUser = this.newUser.bind(this);

    this.writeTaskData = this.writeTaskData.bind(this)
    this.modalMessage = this.modalMessage.bind(this)
  }

  componentDidMount(){
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
    const { objectId, taskId } = this.props

    qauf(getObjectTasksSmall(objectId), _url, localStorage.getItem('auth-token')).then(a=>{
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

  updateCacheFile (data) {
    this.props.taskCacheUpdate({
      variables:{
        value: data,
        action: "uploadFile",
        taskId: this.props.taskId,
      }
    })
  }

  deleteFile (id) {
    qauf(removeFile(id), _url, localStorage.getItem('auth-token')).then((a)=>{
      // console.warn(a)
      this.props.taskCacheUpdate({
        variables:{
          value: {id: id},
          action: "deleteFile",
          taskId: this.props.taskId,
        }
      })
    }).catch((e)=>{
      console.warn(e);
    });
  }

  writeTaskData(value, change, quota, userName) {
    let cap = "";

    // if (value && value.name) {
    //   localStorage.setItem('grnm',value.name);
    //   this.setState({taskName: value.name})
    // }

    if (quota) cap = '"';
    // console.warn("writeData", e, change, this.props.taskId)
    qauf(updTask(this.props.taskId,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
      // console.warn("update task done", a)
      this.modalMessage(a.data.updateTask);
      switch (change) {
      case "assignedTo":
        this.props.taskCacheUpdate({
          variables:{
            action: change,
            value: { id: value, username: userName, key: change },
            taskId: this.props.taskId,
          }
        })
        break;
      default:
        this.props.taskCacheUpdate({
          variables:{
            value: { value : value, key : change },
            action: change,
            taskId: this.props.taskId,
          }
        })

        if (change !== "addUser" && change !== "delUser") {
          this.props.objectCacheUpdate({
            variables:{
              value: { value: value, key: change },
              action: "updateTask",
              taskId: this.props.taskId,
              objectId: this.props.objectId
            }
          })
        }
        break;
      }
    }).catch((e)=>{
      console.warn(e);
    })
  }

  newUser(e){
    // console.log(e.target)
    this.setState({
      newUser: e.target.value,
    })
  }

  modalMessage(e){
    const type = typeof e;

    switch (type) {
    case "boolean":
      e ?
        this.setState({
          modalMessageShow: true,
          modalMessage: "Изменения сохранены",
        }) :
        this.setState({
          modalMessageShow: true,
          modalMessage: "Произошла ошибка",
        })
      break;
    case "string":
      this.setState({
        modalMessageShow: true,
        modalMessage: e,
      })
      break;
    case "object":
      this.setState({
        modalMessageShow: true,
        modalMessage: `Файл ${e.name} размером ${e.size} загружен!`,
      })
      break;
    default:
      console.warn("FUCK")
      setTimeout(()=>{
        this.setState({
          modalMessageShow: false,
          modalMessage: "",
        })
      }, 5000)
      break;
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
      updateUsersTask(task: {id: "${this.props.taskId}", delete: ${dels}, users: ["${userId}"]} )
    }`)} ;


    if(typeof q === "function"){
      qauf(q(), _url, localStorage.getItem('auth-token')).then(a=>{

        this.modalMessage(a.data.updateUsersTask);
        !dels ?
          this.props.taskCacheUpdate({
            variables:{
              action: "addUser",
              value: { id: userId, username: this.state.newUser },
              taskId: this.props.taskId,
            }
          }) : this.props.taskCacheUpdate({
            variables:{
              action: "delUser",
              value: { id: userId },
              taskId: this.props.taskId,
            }
          })

        this.setState({
          newUser: "",
        })
      })
        .catch((e)=>{
          console.warn(e);
        });
    }else{
      return false;
    }

  }

  glossStatus(){
    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        status: [" ",...a.data.glossary.taskStatuses]})
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  downloadFile (file) {
    // console.warn("FILE is", file)
    axios({
      url: `http://${_url}/download/${file.id}`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: file.mimeType}));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
    });
  }

  render() {
    const { allusers, modal, status, allTasks } = this.state;
    const { taskId, data } = this.props;


    // let data = dataObject.filter((task) => (task.id === taskId))[0]

    // console.warn("TASKID", data)

    let dataValue;

    let taskStatus = data.status

    if (data.endDate) dataValue = data.endDate.replace(/T.*$/gi, "")

    return(
      <Content view="OvH">
        <InnerBar>
          <div className="tab-roll">
            <div className="header"><h4>Пользователи</h4></div>
            <div className="content">
              <div className="content-scroll">

                {data.users && data.users.map(
                  (e,i)=>{
                    return(
                      <div className="username" role="presentation" key={'usr-'+i} >
                        {localStorage.getItem('userid') !== e.id ?
                          <UserRow id={e.id} name={e.username} icon="1" ondelete={(id)=>this.userAdd(id, false)} />
                          : null }
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
                }
              </div>

              <div className="FakeLinkSvg"><Svg svg="expose" size="32" /></div>
            </div>
          </div>
          <div className="tab-roll">
            <div className="header"><h4>Документы</h4></div>
            <div className="content">
              <div className="content-scroll">
                {data.files && data.files.length > 0 ? data.files.map(
                  (e)=>{
                    return(
                      <FileRow key={e.id} name={e.name} id={e.id} type={e.mimeType} icon="doc" ondelete={(id)=>{this.deleteFile(id)}} click={this.downloadFile} />
                    )
                  }
                ) : (
                  <div>
                    {/* <FileRow name="Смета_проекта.doc" id="id1235" icon="doc" />
                                  <FileRow name="Фото подвала.jpg" id="id1237" icon="img" /> */}
                    <div className="FakeLink">Файлов нет</div>
                  </div>
                )
                }
              </div>
            </div>
          </div>

          <div className="content">
            <div className="Btn v1" onClick={()=>{this.setState({modal: !modal});this.getTaskLists()}}>Редактировать</div>
          </div>

        </InnerBar>
        {modal ? (
          <Modal close={()=>{ this.setState({modal: !modal}) }} message={this.state.modalMessageShow?this.state.modalMessage:""}>

            <ModalRow>
              <ModalCol>
                <InputWrapper name={data.name} save="Сохранить" click={(name)=>this.writeTaskData(name, 'name', true)}>
                            Название
                </InputWrapper>
              </ModalCol>
            </ModalRow>


            <ModalRow>
              <ModalCol>
                <ModalBlockName>
                            Статус
                </ModalBlockName>

                <ResponsibleRow >
                  <UserRow id={taskStatus || "1"} name={this.state.status.find(x => x.id == taskStatus) && this.state.status.find(x => x.id == taskStatus).name ? this.state.status.find(x => x.id == taskStatus).name : "Новая"}/>
                  {status ? <FakeSelect array={status} onselect={(id, name, icon)=>{this.writeTaskData(id, "status", false)}} defaultid={taskStatus || "1"}/> : null}
                </ResponsibleRow>

              </ModalCol>

              <ModalCol>
                <ModalBlockName>
                            Ответственный
                </ModalBlockName>
                <ResponsibleRow >
                  <UserRow id={data.assignedTo && data.assignedTo.id ? data.assignedTo.id : "0"} name={data.assignedTo && data.assignedTo.username ? data.assignedTo.username : "не указано"} ondelete={()=>this.writeTaskData(null, "assignedTo", false, null)}/>
                  <FakeSelect array={data.users} onselect={(id,name,icon)=>{this.writeTaskData(id, "assignedTo",true, name)}} defaultid={data.assignedTo && data.assignedTo.id ? data.assignedTo.id : "0"} />
                </ResponsibleRow>
              </ModalCol>
            </ModalRow>

            <ModalRow>
              <ModalCol>
                <div className="ModalBlockName">
                          Срок истечения
                </div>
                <label htmlFor="dateselect" className="LabelInputDate">
                  <input type="date" name="dateselect" defaultValue={ dataValue } placeholder="Дата Завершения" onChange={(e)=>{this.writeTaskData(e.target.value, "endDate", true)}} />
                </label>
              </ModalCol>

              <ModalCol>
                <ModalBlockName>
                          Добавить родительскую задачу
                </ModalBlockName>
                <ResponsibleRow >
                  <UserRow id={data.parentId} name={allTasks.find(x => x.id == data.parentId) ? allTasks.find(x => x.id == data.parentId).name : "не указано"} ondelete={()=>this.writeTaskData(null, "parentId", false)}/>
                  <FakeSelect array={allTasks} onselect={(id,name,icon)=>{this.writeTaskData(id, "parentId",true)}} defaultid={data.parentId} />
                </ResponsibleRow>

                {/* <FakeSelect array={allTasks} onselect={(id,name,icon)=>{this.writeTaskData(id, "parentId",true)}} defaultid={data.parentId} /> */}
              </ModalCol>
            </ModalRow>
            <ModalRow>
              <ModalCol>
                <ModalBlockName>
                          Добавить пользователя
                </ModalBlockName>
                <div className="content">
                  <label className="LabelInputList" htmlFor="users">
                    <input type="list" name="users" list="users" autoComplete="on" value={this.state.newUser} onChange={this.newUser} />
                    {
                      this.state.newUser ? (
                        <div className="Button3" onClick={()=>this.userAdd(this.state.newUser, 1)}>Добавить{/*this.state.newUser*/}</div>
                      ): null
                    }

                    <datalist id="users">
                      {
                        data.users && data.users.length > 0 ?  _.differenceWith(allusers, data.users, _.isEqual).map((e)=>(
                          <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                        )
                        ) : allusers.map((e)=>(
                          <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                        )
                        )
                      }
                    </datalist>
                  </label>
                </div>

              </ModalCol>
            </ModalRow>
            <ModalCol>
              <ModalBlockName>
                        Добавить вложения
              </ModalBlockName>
              {data.files && data.files.length > 0 ? data.files.map((e)=>{
                return(
                  <FileRow key={e.id} name={e.name} id={e.id} type={e.mimeType} icon="doc" ondelete={(id)=>{this.deleteFile(id)}} click={this.downloadFile} />
                )
              }
              ) : (
                <div>
                  <div className="FakeLink">Файлов нет</div>
                </div>
              )
              }
              <ModalCol>
                {/* <div className="files-drop"> */}
                {/* <Svg svg="tocloud" inline={0} />переместите файлы сюдa */}
                <Mutation mutation={uploadFile} onCompleted={(data) => {
                  // console.warn(data)
                  this.modalMessage(data.uploadFile);
                  this.updateCacheFile(data.uploadFile)
                }}>
                  {upload => (
                    <Dropzone className="files-drop" onDrop={([file]) => {upload({ variables: { id: taskId, file } })}}>
                      <p>Переместите сюда файлы или нажмите для добавления.</p>
                    </Dropzone>
                  )}
                </Mutation>
                {/* </div> */}
              </ModalCol>
            </ModalCol>
          </Modal>
        ) : null
        }
      </Content>
    )}
}


TaskView.propTypes = {
  selectUser: PropTypes.func.isRequired,
  taskCacheUpdate: PropTypes.func.isRequired,
  objectCacheUpdate: PropTypes.func.isRequired,
};

export default compose(
  graphql(taskCacheUpdate, { name: 'taskCacheUpdate' }),
  graphql(objectCacheUpdate, { name: 'objectCacheUpdate' }),
  graphql(selectUser, { name: 'selectUser' }),
)(TaskView);


