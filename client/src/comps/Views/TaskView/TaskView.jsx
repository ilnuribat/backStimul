import React, { Component } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';
// import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { qauf, _url } from '../../../constants';
import 'animate.css';
import moment from 'moment';
import momentRu from 'moment/locale/ru';
import ChatView from '../ChatView/ChatView';
import Loading from '../../Loading';
import { uploadFile, updTask } from '../../../GraphQL/Qur/Mutation';
import { selectUser, setChat } from '../../../GraphQL/Cache';
import { allUsers, glossaryStatus, GR_QUERY, getObjectTasks3 } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
// import Bar from '../../Lays/Bar/index';
// import Panel from '../../Lays/Panel/index';
import '../../../newcss/taskview.css'
import { ButtonTo, UserRow, FileRow, TextRow, IconRow } from '../../Parts/Rows/Rows';
import Modal, {InputWrapper, ModalRow, ModalCol, ModalBlockName} from '../../Lays/Modal/Modal';
import Svg from '../../Parts/SVG'
import InnerBar from '../../Lays/InnerBar/InnerBar';
// import ContentInner from '../../Lays/ContentInner/ContentInner';

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
      modal: false,
      inputSaver: {},
      newUser: "",
      addressList: [],
      upload: false,
      modalMessage:"",
      modalMessageShow:false,
    }

    this.allUserGet = this.allUserGet.bind(this);
    this.userAdd = this.userAdd.bind(this);
    this.glossStatus = this.glossStatus.bind(this);
    this.newUser = this.newUser.bind(this);

    this.writeTaskName = this.writeTaskName.bind(this)
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

  writeTaskName(name) {
    console.warn("writeName", name, this.state.taskId)
    qauf(updTask(this.state.taskId,`{name: "${name}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn(a)
    }).catch((e)=>{
      console.warn(e);
    })
  }

  writeTaskData(e, change, quota) {
    let cap = ""
    const value = e.target.value

    if (quota) cap = '"';
    // console.warn("writeData", e, change, this.state.taskId)
    qauf(updTask(this.state.taskId,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("update task done", a)
      this.modalMessage(a.data.updateTask);
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
    // console.log(e.target)
    if(e === true){
      this.setState({
        modalMessageShow: true,
        modalMessage: "Изменения сохранены",
      })
    }else if(typeof e === "string"){
      this.setState({
        modalMessageShow: true,
        modalMessage: e,
      })
    }else{
      this.setState({
        modalMessageShow: true,
        modalMessage: "Произошла ошибка",
      })
    }
    setTimeout(()=>{
      this.setState({
        modalMessageShow: false,
        modalMessage: "",
      })
    }, 5000)

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
        console.warn("Answer updUsrGr",a)
        this.modalMessage(a.data.updateTask);
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

  glossStatus(){
    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        status: [" ",...a.data.glossary.taskStatuses]})
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  render() {
    const {/*upload,*/ allusers, taskName, taskId, modal, status, allTasks } = this.state;
    // console.warn("TASKID", status)

    return(
      taskId ?
        <Query
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
            // console.warn("DATA", data)
            let dataValue;
            let taskStatus = data.task.status

            if (data.task.endDate) dataValue = data.task.endDate.replace(/T.*$/gi, "")

            return(
              <Content view="OvH">
                <div className="TaskViewTop">
                  <ButtonTo url={"/board"} icon="back">Назад</ButtonTo>
                  <div className="TaskViewTopName"><h1>{taskName}</h1></div>
                </div>
                <div className="TaskView Row Pad10">
                  <div className="TaskViewInner" view="">
                    <ChatView name={taskName} id={taskId} taskInfo={ data.task } priv={0} />
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
                        <UserRow size="24" id={data.task.assignedTo.id} name={data.task.assignedTo.username} icon="1" />
                      </TextRow>
                      {
                        console.log(data.task.assignedTo.username)
                      }
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
                                        <UserRow id={e.id} name={e.username} icon="1" />
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
                            <div className="FakeLink">Показать все</div>
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
                              {data.task.docs ? data.task.docs.map(
                                (e,i)=>{
                                  return(
                                    <FileRow name={e.name} id={e.id} icon="doc" />
                                  )
                                }
                              ) : (
                                <div>
                                    <FileRow name="Смета_проекта.doc" id="id1235" icon="doc" />
                                    <FileRow name="Фото подвала.jpg" id="id1237" icon="img" />
                                    <div className="FakeLink">Показать все</div>
                                </div>
                              )
                              }
                            </div>
                          </div>
                        </div>
                      ): null
                    }



                    {
                      // taskId? (
                      //   <div className="tab-roll">
                      // <div className="header"><h4>Добавить пользователя</h4></div>
                      // <div className="content">
                      //   <label className="Pad" htmlFor="users">
                      //     <input type="list" name="users" list="users" autoComplete="on" onChange={this.newUser} />
                      //     {
                      //       this.state.newUser ? (
                      //         <div className="Button3" onClick={()=>this.userAdd(this.state.newUser, 1)}>Добавить{/*this.state.newUser*/}</div>
                      //       ): null
                      //     }

                      //     <datalist id="users">
                      //       {
                      //         data.task.users && data.task.users.length > 0 ?  _.differenceWith(allusers, data.task.users, _.isEqual).map((e)=>(
                      //           <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                      //         )
                      //         ) : allusers.map((e)=>(
                      //           <option key={e.id} data-id={e.id} valueid={e.id} >{e.username}</option>
                      //         )
                      //         )
                      //       }
                      //     </datalist>
                      //   </label>
                      // </div>
                      //   </div>
                      // ) : null
                    }
                    {
                      taskId ? (
                        <div className="tab-roll">
                          <div className="header"></div>
                          <div className="content">
                            <div className="Button2" onClick={()=>{this.setState({modal: !modal});this.getTaskLists()}}>Редактировать</div>
                            <div className="content-scroll">
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                    {/* {taskId ? (
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
                  } */}
                  </InnerBar>
                </div>
                {modal ? (
                  <Modal close={()=>{ this.setState({modal: !modal}) }} small="" message={this.state.modalMessageShow?this.state.modalMessage:""}>
                    <InputWrapper name={data.task.name} save="Сохранить" click={this.writeTaskName}>
                        Название
                    </InputWrapper>

                    <ModalRow>
                      <ModalCol>
                        <ModalBlockName>
                            Статус
                        </ModalBlockName>
                        <label htmlFor="">
                          <select onChange={(e)=>{this.writeTaskData(e, "status", false)}} defaultValue={taskStatus}>
                            {/* <option value="0">Выбрать задачу</option> */}
                            {
                              status.map((e)=>(
                                <option key={'status'+ e.id} value={e && e.id ? e.id : "no"}>
                                  {e.name}
                                </option>
                              ))
                            }
                          </select>
                        </label>
                      </ModalCol>

                      <ModalCol>
                        <ModalBlockName>
                            Ответственный
                        </ModalBlockName>
                        {/* <UserRow id={data.task.assignedTo && data.task.assignedTo.id ? data.task.assignedTo.id : null} name={data.task.assignedTo && data.task.assignedTo.username ? data.task.assignedTo.username : "null"} icon="e" /> */}
                        <ResponsiblePerson data={data.task} onClick1={this.writeTaskData}/>
                      </ModalCol>
                    </ModalRow>

                    <ModalRow>
                      <ModalCol>
                        <div className="ModalBlockName">
                      Срок истечения
                        </div>
                        <label htmlFor="">
                          <input type="date" defaultValue={ dataValue } placeholder="Дата Завершения" onChange={(e)=>{this.writeTaskData(e, "endDate", true)}} />
                        </label>
                      </ModalCol>

                      <ModalCol>
                        <ModalBlockName>
                    Добавить родительскую задачу
                        </ModalBlockName>
                        <label htmlFor="">
                          <select onChange={(e)=>{e.target.value !==0 ? this.writeTaskData(e, "parentId", true) : null}} defaultValue={data.task.parentId} >
                            { !data.task.parentId ? <option value="0">Выбрать задачу</option> : null}
                            {
                              allTasks.map((e)=>{
                                return(
                                  <option key={e.id} value={e.id} /*selected={data.task.parentId===e.id ? true: false }*/>{e.name}</option>
                                )
                              })
                            }
                          </select>
                        </label>
                      </ModalCol>
                      </ModalRow>
                      <ModalRow>
                      <ModalCol>
                        <ModalBlockName>
                          Добавить пользователя
                        </ModalBlockName>
                          <div className="content">
                            <label className="" htmlFor="users">
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
                      <FileRow name="Смета_проекта.doc" id="id1235" icon="doc" />
                      <FileRow name="Фото подвала.jpg" id="id1237" icon="img" />
                      <ModalCol>
                        <div className="files-drop">
                          <Svg svg="tocloud" inline={0} />переместите файлы сюдa
                        </div>
                      </ModalCol>
                    </ModalCol>
                  </Modal>
                ) : null

                }



              </Content>
            )}
          }
        </Query>
        : <Loading />
    );
  }
}

class ResponsiblePerson extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      save: false,
      userName: "Не выбран",
      userId: ""
    }
  }

  componentDidMount(){
    if (this.props.data.assignedTo)
      this.setState({userName: this.props.data.assignedTo.username, userId: this.props.data.assignedTo.id })
  }

  handleClick = () => {
    this.setState({save: !this.state.save})
  }

  writeTaskResponsiblePerson (e)
  {
    // console.warn(e.target.querySelector(`option[value="${e.target.value}"]`).text)

    this.setState({ userId: e.target.value, userName: e.target.querySelector(`option[value="${e.target.value}"]`).text })
    this.props.onClick1(e, "assignedTo", true);
    this.handleClick()
  }

  render() {
    const { data } = this.props
    const { save, userName, userId } = this.state


    return (
      !save ?
        <UserRow click = {this.handleClick} size="32" id={userId} name={userName} icon="1" />
        :
        <label htmlFor="">
          <select onChange={(e)=>{this.writeTaskResponsiblePerson(e)}} defaultValue={userName} >
            <option value="0">Выбрать ответственного</option>
            {
              data.users.map((e)=>{
                return(
                  <option key={e.id} value={e.id}>{e.username}</option>
                )
              })
            }
          </select>
        </label>
    );
  }
}

TaskView.propTypes = {
  selectUser: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
  location: PropTypes.object
};

export default compose(
  graphql(setChat, { name: 'setChat' }),
  graphql(selectUser, { name: 'selectUser' }),
)(TaskView);
