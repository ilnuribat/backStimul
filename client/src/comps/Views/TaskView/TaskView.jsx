import React, { Component } from 'react';
import { graphql, compose, Query, Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import axios from 'axios';
import 'animate.css';
import moment from 'moment';
// import momentRu from 'moment/locale/ru';
import { qauf, _url } from '../../../constants';
import ChatView from '../ChatView/ChatView';
import Loading from '../../Loading';
import { uploadFile, removeFile, updTask } from '../../../GraphQL/Qur/Mutation';
import { selectUser, setChat, taskCacheUpdate, objectCacheUpdate } from '../../../GraphQL/Cache';
import { allUsers, glossaryStatus, GR_QUERY, getObjectTasksSmall } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
// import Bar from '../../Lays/Bar/index';
// import Panel from '../../Lays/Panel/index';
import '../../../newcss/taskview.css'
import { ButtonTo, UserRow, FileRow, TextRow, ResponsibleRow } from '../../Parts/Rows/Rows';
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
      taskId: "",
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
    const { location } = this.props;

    let _grid
    let _grnm
    let _objId

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
        taskId: this.state.taskId,
      }
    })
  }

  deleteFile (id) {
    qauf(removeFile(id), _url, localStorage.getItem('auth-token')).then((a)=>{
      console.warn(a)
      this.props.taskCacheUpdate({
        variables:{
          value: {id: id},
          action: "deleteFile",
          taskId: this.state.taskId,
        }
      })
    }).catch((e)=>{
      console.warn(e);
    });
  }

  writeTaskData(value, change, quota, userName) {
    let cap = "";

    if (value && value.name) {
      localStorage.setItem('grnm',value.name);
      this.setState({taskName: value.name})
    }

    if (quota) cap = '"';
    console.warn("writeData", value, change, this.state.taskId)
    qauf(updTask(this.state.taskId,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("update task done", a)
      this.modalMessage(a.data.updateTask);
      switch (change) {
      case "assignedTo":
        this.props.taskCacheUpdate({
          variables:{
            action: change,
            value: { id: value, name: userName },
            taskId: this.state.taskId,
          }
        })
        break;
      default:
        this.props.taskCacheUpdate({
          variables:{
            value: { [change]: value },
            action: change,
            taskId: this.state.taskId,
          }
        })

        if (this.props.location.state && this.props.location.state.objectId && change !== "addUser" && change !== "delUser") {
          console.warn("location!!",this.props.location.state.objectId, change )
          this.props.objectCacheUpdate({
            variables:{
              value: { value: value, key: change },
              action: "updateTask",
              taskId: this.state.taskId,
              objectId: this.props.location.state.objectId
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
      updateUsersTask(task: {id: "${this.state.taskId}", delete: ${dels}, users: ["${userId}"]} )
    }`)} ;


    if(typeof q === "function"){
      qauf(q(), _url, localStorage.getItem('auth-token')).then(a=>{
        // console.warn("Answer updUsrGr",a.data)
        this.modalMessage(a.data.updateUsersTask);
        !dels ?
          this.props.taskCacheUpdate({
            variables:{
              action: "addUser",
              value: { id: userId, name: this.state.newUser },
              taskId: this.state.taskId,
            }
          })
          :
          this.props.taskCacheUpdate({
            variables:{
              action: "delUser",
              value: { id: userId },
              taskId: this.state.taskId,
            }
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
    const { allusers, taskId, modal, status, allTasks } = this.state;
    // console.warn("TASKID", status)

    return(
      taskId ?
        (<Query
          query={GR_QUERY}
          variables={{ id: `${taskId}` }}
        >
          {({ loading, error, data }) => {
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
            // console.warn("DATA", data.task)

            if (!data || !data.task)
              return null

            let dataValue;

            let taskStatus = data.task.status

            if (data.task.endDate) dataValue = data.task.endDate.replace(/T.*$/gi, "")

            return(
              <Content view="OvH">
                <div className="TaskViewTop">
                  <ButtonTo url={"/board"} icon="back">Назад</ButtonTo>
                  <div className="TaskViewTopName"><h1>{data.task.name}</h1></div>
                </div>
                <div className="TaskView Row Pad10">
                  <div className="TaskViewInner" view="">
                    <ChatView name={data.task.name} id={taskId} taskInfo={ data.task } priv={0} />
                  </div>
                  <InnerBar>
                    <TextRow name="Информация" view="BigName">
                      <TextRow name="" view="Pad510 MT10">
                        {
                          data.task.name
                        }
                      </TextRow>
                      <TextRow name="" view="cgr Pad510 s">
                        {
                          dataValue ? moment(dataValue).format('D MMMM, h:mm') : null
                        }
                      </TextRow>
                      <TextRow name="" view="cgr Pad510 s">
                        {
                          this.state.status.find(x => x.id == taskStatus) ? this.state.status.find(x => x.id == taskStatus).name : "Новая"
                        }
                      </TextRow>


                      <TextRow name="" view="cgr Pad510 s">
                        {data.task && data.task.assignedTo && data.task.assignedTo.id && data.task.assignedTo.username ? (
                          <UserRow size="24" id={data.task.assignedTo.id} name={data.task.assignedTo.username ? data.task.assignedTo.username : "Нет имени"} icon="1" />
                        ): "Ответственный не назначен"}
                      </TextRow>

                      {/* {
                        console.log(data.task)
                      } */}
                    </TextRow>

                    {
                      taskId ? (
                        <div className="tab-roll">
                          <div className="header"><h4>Пользователи</h4></div>
                          <div className="content">
                            <div className="content-scroll">

                              {data.task.users.map(
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
                      ): null
                    }
                    {
                      taskId ? (
                        <div className="tab-roll">
                          <div className="header"><h4>Документы</h4></div>
                          <div className="content">
                            <div className="content-scroll">
                              {data.task.files && data.task.files.length > 0 ? data.task.files.map(
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
                      ): null
                    }
                    {
                      taskId ? (
                        <div className="content">
                          <div className="Btn v1" onClick={()=>{this.setState({modal: !modal});this.getTaskLists()}}>Редактировать</div>
                        </div>
                      ) : null
                    }
                  </InnerBar>
                </div>
                {modal ? (
                  <Modal close={()=>{ this.setState({modal: !modal}) }}  message={this.state.modalMessageShow?this.state.modalMessage:""}>
                    <InputWrapper name={data.task.name} save="Сохранить" click={(name)=>this.writeTaskData(name, 'name', true)}>
                        Название
                    </InputWrapper>


                    <ModalRow>
                      <ModalCol>
                        <ModalBlockName>
                            Статус
                        </ModalBlockName>

                        <ResponsibleRow >
                          <UserRow id={taskStatus} name={this.state.status.find(x => x.id == taskStatus) ? this.state.status.find(x => x.id == taskStatus).name : "Новая"}/>
                          {status ? <FakeSelect array={status} onselect={(id, name, icon)=>{this.writeTaskData(id, "status", false)}} defaultid={taskStatus}/> : null}
                        </ResponsibleRow>

                      </ModalCol>

                      <ModalCol>
                        <ModalBlockName>
                            Ответственный
                        </ModalBlockName>
                        <ResponsibleRow >
                          <UserRow id={data.task.assignedTo && data.task.assignedTo.id ? data.task.assignedTo.id : "0"} name={data.task.assignedTo && data.task.assignedTo.username ? data.task.assignedTo.username : "не указано"} ondelete={()=>this.writeTaskData(null, "assignedTo", false, null)}/>
                          <FakeSelect array={data.task.users} onselect={(id,name,icon)=>{this.writeTaskData(id, "assignedTo",true, name)}} defaultid={data.task.assignedTo && data.task.assignedTo.id ? data.task.assignedTo.id : "0"} />
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
                          <UserRow id={data.task.parentId} name={allTasks.find(x => x.id == data.task.parentId) ? allTasks.find(x => x.id == data.task.parentId).name : "не указано"} ondelete={()=>this.writeTaskData(null, "parentId", false)}/>
                          <FakeSelect array={allTasks} onselect={(id,name,icon)=>{this.writeTaskData(id, "parentId",true)}} defaultid={data.task.parentId} />
                        </ResponsibleRow>

                        {/* <FakeSelect array={allTasks} onselect={(id,name,icon)=>{this.writeTaskData(id, "parentId",true)}} defaultid={data.task.parentId} /> */}
                      </ModalCol>
                    </ModalRow>
                    <ModalRow>
                      <ModalCol>
                        <ModalBlockName>
                          Добавить пользователя
                        </ModalBlockName>
                        <div className="content">
                          <label className="LabelInputList" htmlFor="users">
                            <input type="list" name="users" list="users" autoComplete="on" onChange={this.newUser} />
                            {
                              this.state.newUser ? (
                                <div className="Button3" onClick={()=>this.userAdd(this.state.newUser, 1)}>Добавить{/*this.state.newUser*/}</div>
                              ): null
                            }

                            <datalist id="users">
                              {
                                data.task.users && data.task.users.length > 0 ?  _.differenceWith(allusers, data.task.users, _.isEqual).map((e)=>(
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
                      {data.task.files && data.task.files.length > 0 ? data.task.files.map((e)=>{
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
                          console.warn(data)
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
        </Query>)
        : (<Loading />)
    )
  }
}

TaskView.propTypes = {
  selectUser: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
  taskCacheUpdate: PropTypes.func.isRequired,
  objectCacheUpdate: PropTypes.func.isRequired,
  location: PropTypes.object
};

export default compose(
  graphql(setChat, { name: 'setChat' }),
  graphql(taskCacheUpdate, { name: 'taskCacheUpdate' }),
  graphql(objectCacheUpdate, { name: 'objectCacheUpdate' }),
  graphql(selectUser, { name: 'selectUser' }),
)(TaskView);


