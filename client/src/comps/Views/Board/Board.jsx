import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import { Redirect } from 'react-router';
import { Link,Redirect } from 'react-router-dom';

import 'animate.css';
import Column from '../../Parts/Column';
import Task from '../../Parts/Task';
import DataQuery from '../../Parts/DataQuery';
import Loading from '../../Loading';
import { qauf, _url } from '../../../constants';
import { setChat, setInfo, rootId, objectCacheUpdate } from '../../../GraphQL/Cache';
import { getObjectTasks, glossaryStatus, TASKS_QUERY, checkObject, TASK_INFO, TASK_MESSAGES } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
import '../../../newcss/boardview.css';
import '../../../newcss/task.css';
import { Svg } from '../../Parts/SVG/index';
import { ButtonRow, TextRow, FileRow, UserRow } from '../../Parts/Rows/Rows';
import Modal, {InputWrapper, ModalRow, ModalCol, ModalBlockName} from '../../Lays/Modal/Modal';
import { updTask, crTask, deleteTask } from '../../../GraphQL/Qur/Mutation';
import Panel from '../../Lays/Panel/index';
import { FakeSelect } from '../../Parts/FakeSelect/FakeSelect'
import ContentInner from '../../Lays/ContentInner/ContentInner';
import ChatView from '../ChatView/ChatView';
import InnerBar from '../../Lays/InnerBar/InnerBar';
import TaskView from '../TaskView/TaskView';


class ChildsMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showTree: false,
    };
  }

  render(){
    const { obj, statuses, open} = this.props;
    const { showTree } = this.state;

    let childs = '';

    if (obj && obj.childs && obj.childs.length > 0) {
      childs = ' Parent'
    }

    let statusName = (st, statuses)=>{

      console.log(st);
      console.log(statuses);

      let stName = statuses.find(e => { if (e.id == st) return e.name });

      console.log(stName.name)

      return stName.name;
    }



    if (obj) {
      let stName = '';
      let highlight = '';

      if (obj.status && statuses){
        stName = statusName(obj.status, statuses);
      }

      if (obj.endDate) {
        let ym = moment(obj.endDate).format("YYYY MM");
        let y = moment(obj.endDate).format("YYYY");
        let m = moment(obj.endDate).format("MM");
        let d = moment(obj.endDate).format("DD");
        let h = moment(obj.endDate).format("HH");

        let ymN = moment().format("YYYY MM");
        let yN = moment().format("YYYY");
        let mN = moment().format("MM");
        let dN = moment().format("DD");
        let hN = moment().format("HH");


        if ((ym === ymN && d < dN) || (yN > y) || (mN > m && y <= yN) && obj.status != '5') {
          highlight = " redd"
          // statusShit = 'истекла:'
        }
        else if ((ym === ymN && d > dN && d - dN <= 3) && obj.status != '5') {
          highlight = " yeld"
        } else {
          // highlight = ''
        }
      }

      return (
        <div className={`TreeTask${childs}`}>
          {
            childs ? !showTree ? <div className="TreePlus" onClick={() => { this.setState({ showTree: true }) }}><Svg svg="plus" /></div> : <div className="TreeMinus" onClick={() => { this.setState({ showTree: false }) }}><Svg svg="minus" /></div> : null
          }
          <div className="TreeName" onClick={() => { open && typeof open === 'function' ? open(obj.id,obj.name) : null }}>
            <span className="name">{ obj.name ? obj.name : "Без названия"}</span>
            {obj.endDate ? <span className={`endDate${highlight}`}>{moment(obj.endDate).format('D MMMM, h:mm')}</span> : null }
            <span className={`status ${obj.status ? "sts" + obj.status : "sts0"}`}>{obj.status ? stName : "Новая"}</span>
          </div>
          {obj.assignedTo && obj.assignedTo.id && obj.assignedTo.username ? <div className="holder">
            <UserRow id={obj.assignedTo.id} name={obj.assignedTo.username} icon="1" />
          </div> : null}
          {
            childs && showTree ? <div className="border"> </div> : null
          }
          {
            childs && showTree ? (<div className="TreeChilds">{obj.childs.map(e => { return (<ChildsMap open={open} statuses={statuses} key={e.id} obj={e} />)})} </div> ): null
          }

        </div>
      )
    }
  }
}

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      objectId:"",
      taskId:"",
      taskIdCreate:"",
      taskName: "",
      rootId: "",
      info:{name:"", id:""},
      status: [],
      toRoot: false,
      toTask: false,
      taskData: {},
      showChilds: false,
      modal: false,
      modalDelete: false,
      HaveObj: false,
      modalMessageShow: false,
      modalMessage: "",
      modalNameCreator: "",
      treeView: false,
      taskDataCreateEdit: {},
    };

    this.daTa = this.daTa.bind(this)
    this.selectTask = this.selectTask.bind(this)
    this.glossStatus = this.glossStatus.bind(this)
    this.childs = this.childs.bind(this)
    this.toTask = this.toTask.bind(this)
    this.toBack = this.toBack.bind(this)

    this.changeModal = this.changeModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.writeTaskData = this.writeTaskData.bind(this)
    this.writeTaskDataMaker = this.writeTaskDataMaker.bind(this)
    this.saveTaskData = this.saveTaskData.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.changeDelModal = this.changeDelModal.bind(this)
    this.modalMessage = this.modalMessage.bind(this)
    this.toTreeView = this.toTreeView.bind(this)
    this.MaptoTree = this.MaptoTree.bind(this)
  }

  daTa(){ return(<DataQuery query={TASKS_QUERY}/>) }

  selectTask(e){
    this.props.setChat({
      variables: {
        id: e.id,
        name: e.name,
        priv: false,
        unr: 0,
      }
    });
  }

  componentWillMount(){

    const { location } = this.props;
    let id = "";
    let tid = "";
    let Mount = false;

    if(location.state && location.state.objectId && location.state.objectId){
      Mount = true;
      id = location.state.objectId

      localStorage.setItem('objectId', id)

      this.setState({
        objectId: id,
      });
    }
    if(location.state && location.state.id){
      Mount = true;
      tid = location.state.id
      localStorage.setItem('taskId', tid)

      this.setState({
        toTask: true,
        taskId: tid,
      });
    }

    if(!location.state || !location.state.objectId){
      Mount = true;
      id = localStorage.getItem('objectId')
      this.setState({
        objectId: id,
      });
    }
    if(!location.state || !location.state.id && localStorage.getItem('taskId') ){
      Mount = true;
      tid = localStorage.getItem('taskId')
      this.setState({
        toTask: true,
        taskId: tid,
      });
    }

    if(id && Mount){
      this.chkObject(id)
      this.glossStatus(id)
    }
  }

  // componentDidMount(){
  //   const { location } = this.props;
  //   let id = location.state && location.state.objectId ? location.state.objectId : localStorage.getItem('objectId')

  //   console.log("location.state ------------ ", location.state )

  //   if(id){
  //     this.chkObject(id)
  //     this.glossStatus(id)
  //   }
  // }

  toBack(id){
    console.warn("TO BACK",id);

    if(id){
      localStorage.setItem('rootId', id)
      this.props.rootId({
        variables:{
          id: id,
        }
      })
    }
  }

  toTask(id, name){
    if(id){
      localStorage.setItem('taskId', id)
    }

    this.props.setChat({
      variables: {
        id: id === this.state.taskId ? "" : id,
        name: id === this.state.taskId ? "" : name,
        priv: false,
      }
    });

    this.setState({
      toTask: id === this.state.taskId ? false : true,
      taskId: id === this.state.taskId ? "" : id,
      taskName: id === this.state.taskId ? "" : name
    })

    if (id === this.state.taskId) {
      localStorage.setItem('taskId', "")
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.warn("REMOUNT!!")
    const { location } = this.props;
    const { objectId, taskId } = this.state;
    let id = "";
    let tid = "";
    let Mount = false;

    if(location.state && location.state.objectId && location.state.objectId !== objectId){
      // console.warn("REMOUNT OBJECT ID!!")
      Mount = true;
      id = location.state.objectId
      // localStorage.setItem('objectId', id)
    }
    // if(location.state && location.state.id && location.state.id !== taskId){
    //   Mount = true;
    //   tid = location.state.id
    //   // localStorage.setItem('taskId', tid)
    // }

    if (location && location.state && prevProps.location && prevProps.location.state
      && prevProps.location.state.id && taskId !== location.state.id && taskId === prevState.taskId){
        // console.warn("REMOUNT TASK ID!!")
      Mount = true;
      tid = location.state.id
    }

    // if(!location.state || !location.state.objectId){
    //   Mount = true;
    //   id = localStorage.getItem('objectId')
    //   this.setState({
    //     objectId: id,
    //   });
    // }
    // if(!location.state || !location.state.id ){
    //   Mount = true;
    //   tid = localStorage.getItem('taskId')
    //   this.setState({
    //     toTask: true,
    //     taskId: tid,
    //   });
    // }


    if((id || tid) && Mount){
      this.setState({
        objectId: id ? id : this.state.objectId,
        toTask: tid ? true : false,
        taskId: tid ? tid : "",
      });
      this.chkObject(id)
      this.glossStatus(id)
    }

    // if(prevProps.location.state == this.props.location.state) return false

    // location.state && location.state.objectId ? id = location.state.objectId : id = localStorage.getItem('objectId')
    // location.state && location.state.id ? taskId = location.state.id : id = localStorage.getItem('taskId')

    // if(id){
    //   this.setState({
    //     objectId: id,
    //     taskId: taskId,
    //   });
    //   this.chkObject(id)
    //   this.glossStatus(id)
    // }
  }
  shouldComponentUpdate(nextProps){

    if(nextProps.location.state != this.props.location.state){
      return true
    }

    return true

  }


  childs(id){
    console.warn(id)
    if(id){
      this.setState({
        showChilds: !this.state.showChilds,
        curParentId: id
      });
    }
  }

  changeModal () {
    this.setState({
      modal: !this.state.modal,
    });
  }

  closeModal () {
    this.setState({
      modal: false,
    });
    this.setState({
      taskIdCreate: "",
    })
  }

  glossStatus(){
    if (this.state.status.length === 0)
      qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
        this.setState({
          status: [{id: 0, name: "Нет"},...a.data.glossary.taskStatuses],
        });
      })
        .catch((e)=>{
          console.warn(e);
        });
  }

  deleteTask () {
    qauf(deleteTask(this.state.taskIdCreate), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("delete task done", a)
      // this.props.objectCacheUpdate({
      //   variables:{
      //     action: "deleteTask",
      //     taskId: this.state.taskIdCreate,
      //     objectId: this.state.objectId
      //   }
      // })
      this.changeDelModal("")
    }).catch((e)=>{
      console.warn(e);
    })
  }

  changeDelModal (id) {
    this.setState({
      taskIdCreate: id,
      modalDelete: !this.state.modalDelete,
    });
  }

  modalMessage(message){
    if(message){
      this.setState({
        modalMessageShow: true,
        modalMessage: message.toString(),
      })
      setTimeout(() => {
        this.setState({
          modalMessageShow: false,
          modalMessage: "",
        })
      }, 3000);
    }
  }

  saveTaskData(value, change, quota) {
    let { taskDataCreateEdit } = this.state;
    let cap = '';
    quota ? cap = '"' : null;

    taskDataCreateEdit[`${change}`] = value;

    console.log(taskDataCreateEdit)

    this.setState({
      taskDataCreateEdit: taskDataCreateEdit
    })
  }
  writeTaskDataMaker() {

    function stringify(obj_from_json) {
      if (typeof obj_from_json !== "object" || Array.isArray(obj_from_json)) {
        return JSON.stringify(obj_from_json);
      }
      let props = Object
        .keys(obj_from_json)
        .map(key => `${key}:${stringify(obj_from_json[key])}`)
        .join(",");
      return `{${props}}`;
    }

    var obj = {
      name: "John Smith",
      job: {
        name: "Accountant",
        salary: 1000
      },
      favortieFruits: ["Apple", "Banana"]
    };

    let { taskDataCreateEdit, objectId } = this.state;

    let mapper = taskDataCreateEdit;

    mapper && mapper.status ? mapper.status = Number(mapper.status) : null;
    
    if (!this.state.taskIdCreate){
      mapper.objectId = objectId;
      mapper && !mapper.name ? mapper.name = "Нет названия" : null;

      qauf(crTask(stringify(mapper)), _url, localStorage.getItem('auth-token')).then(a => {
        console.warn("create task done", a.data.createTask.id)
        this.modalMessage("Изменения сохранены");
        this.setState({
          taskIdCreate: a.data.createTask.id,
          modal: false
        })
      }).catch((e) => {
        this.modalMessage("Ошибка" + e);
        console.warn(e);
      })
    }
    else{
      qauf(updTask(this.state.taskIdCreate, stringify(mapper) ), _url, localStorage.getItem('auth-token')).then(a => {
        console.warn("update task done", a)
        this.setState({
          modal: false
        })
      }).catch((e) => {
        this.modalMessage("Ошибка " + e);
        console.warn(e);
      })
    }

  }
  writeTaskData(value, change, quota) {
    let cap = ""

    quota ? cap = '"' : null;

    let changes = `${change}: ${cap}${value}${cap}`;

    if (change !== "name"){
      changes = `name: "Нет названия", ${change}: ${cap}${value}${cap}`
    }
    console.warn("CHANGE", this.state.taskIdCreate, change)
    if (!this.state.taskIdCreate)
      qauf(crTask(`{${changes}, objectId: "${this.state.objectId}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("create task done", a.data.createTask.id)
        // this.props.objectCacheUpdate({
        //   variables:{
        //     value: {[change] : value},
        //     action: "createTask",
        //     taskId: a.data.createTask.id,
        //     objectId: this.state.objectId
        //   }
        // })
        this.modalMessage("Изменения сохранены");
        this.setState({
          taskIdCreate: a.data.createTask.id,
        })
      }).catch((e)=>{
        this.modalMessage("Ошибка"+e);
        console.warn(e);
      })
    else
      qauf(updTask(this.state.taskIdCreate,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("update task done", a)
        this.modalMessage("Изменения сохранены");
        // this.props.objectCacheUpdate({
        //   variables:{
        //     value: {value : value, key : change},
        //     action: "updateTask",
        //     taskId: this.state.taskIdCreate,
        //     objectId: this.state.objectId
        //   }
        // })
      }).catch((e)=>{
        this.modalMessage("Ошибка " + e);
        console.warn(e);
      })
  }

  chkObject(id){
    qauf(checkObject(id), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.name){
        this.setState({
          HaveObj: true,
        });

      }
    }).catch((e)=>{
      console.warn(e);
    })
  }

  toTreeView(){
    this.setState(
      {
        treeView: !this.state.treeView,
      }
    )
  }

  MaptoTree(array) {

    let tree = (data, root) => {
      var r;

      data.forEach(function (a) {
        this[a.id] = { id: a.id, text: a.name, childs: this[a.id] && this[a.id].childs };
        if (a.parentId === root) {
          r = this[a.id];
        } else {
          this[a.parentId] = this[a.parentId] || {};
          this[a.parentId].childs = this[a.parentId].childs || [];
          this[a.parentId].childs.push(this[a.id]);
        }
      }, Object.create(null));

      return r;
    };
    let _A = tree(array, 0);

    return _A;

  }



  render(){
    const { objectId, status, taskId, toTask, showChilds, treeView } = this.state;
    const { setInfo } = this.props;
    let ObjectData;

    if(objectId && status){

      return (
        <Query query={getObjectTasks} variables={{ id: objectId}} >
          {({ loading, error, data }) => {
            if (loading){
              return (
                <div style={{ paddingTop: 20, margin: "auto"}}>
                  <Loading />
                </div>
              );
            }
            if (error){

              console.log("ERROR", error.message);
              let message = 'Неизвестная ошибка';

              switch (error.message) {
                case "Network error: Failed to fetch":
                  message = "Не удается подключиться"
                  break;

                default:
                  break;
              }

              return (
                <div className="errorMessage">
                  {message}
                </div>
              );
            }

          if(data && data.object){
              ObjectData = data.object;
              let selectedChilds = false;
              let ObjTasks = [];
              ObjTasks = data.object.tasks.slice();

              if (this.state.curParentId && this.state.showChilds)
              {
                ObjTasks = ObjTasks.filter((task) => (task.parentId === this.state.curParentId || task.id === this.state.curParentId));
              }

              let arr = _.sortBy(ObjTasks, 'status');
              let cols = [[],[],[],[],[],[],[]];

              console.log(ObjTasks);
              

              const taskData = ObjTasks.filter((task) => (task.id === this.state.taskId))[0]

              arr = _.sortBy(ObjTasks, 'unreadCount');
              _.forEach(arr, (result)=>{
                if(!result.status){
                  cols[1].push(result);
                }
                if(result.status){
                  cols[result.status].push(result);
                }
              });

              let newTasks = {};
              let tasks = ObjTasks.map(a => ({...a}));

              for (let i = 0; i < tasks.length; i ++) {
                tasks[i].childs = [];

                for (let j = 0; j < tasks.length; j ++) {
                  if (i !== j) {
                    if (tasks[i].id == tasks[j].parentId) {
                      tasks[i].childs.push(tasks[j]);
                    }
                  }
                }
              }

              tasks = tasks.filter(t => !t.parentId);

              newTasks = Object.assign({}, tasks);

              return(
                <Fragment>
                  <Content view="Board">
                    {toTask && taskId ?
                      <InnerBar view="Pad0">
                        <Query query={TASK_MESSAGES} variables={{ id: `${taskId}` }} >
                          {({ loading, error, data }) => {
                            let a = false;

                            if (loading){

                              return (
                                <div style={{ paddingTop: 20, margin: "auto"}}>
                                  <Loading />
                                </div>
                              );
                            }
                            if (error){

                              console.log("ERROR", error.message);
                              let message = 'Неизвестная ошибка';

                              switch (error.message) {
                                case "Network error: Failed to fetch":
                                  message = "Не удается подключиться"
                                  break;

                                default:
                                  break;
                              }

                              return (
                                <div className="errorMessage">
                                  {message}
                                </div>
                              );
                            }

                            if (data && data.task && data.task.objectId === objectId){
                              return (
                                <ChatView id={taskId} priv={false} data={data.task} name={data.task.name} />
                              )
                            }

                            else{
                              localStorage.setItem('taskId', '');

                              return < div className="errorMessage" > Выберите или создайте задачу </div>
                            }
                          }}
                        </Query>
                      </InnerBar> : null }
                    <ContentInner view="Board-Content-Wrap">
                      <div className="Board-Top">
                        {
                          data.object.parentId ? (<div className="toBack" onClick={()=>{this.toBack(data.object.parentId)}}>
                            <Link to={{
                              pathname: '/tile',
                              state: { rootId: data.object.parentId }
                            }} className="toBackLink">
                              <Svg svg="back" /><span>Назад</span>
                            </Link></div>) : null
                        }
                        <div className="BoardTopCenter">
                          <h1>{data.object.name}</h1>
                          <ButtonRow icon="plus" iconright="1" click={this.changeModal}>Создать задачу</ButtonRow>
                          <ButtonRow iconright="1" click={this.toTreeView}>{treeView ? "Доска" : "Дерево" }</ButtonRow>
                        </div>

                      </div>

                      

                      {treeView ? (
                        <ContentInner view="Board-Content-Tree">
                          <div className="inner">
                            <div className="TreeViewName TopLevel">
                              {ObjectData.name}
                            </div>
                            <div className="border"></div>
                            {
                              tasks.map((a, i, earr) => {
                                return(
                                  <ChildsMap open={this.toTask} obj={a} statuses={status ? status : null}/>
                                )
                              })
                            }
                          </div>
                        </ContentInner>
                      ) : (
                        <ContentInner view="Board-Content">
                          {
                            status && status.map((e,i)=>{
                              if( i === 0 ){
                                return (true)
                              }

                              return(
                                <Column key={e.id} id={e.id} status={e.name} name={e.name} >
                                  {e.id == 1 ? <ButtonRow icon="plus" view="MiniBox" iconright="1" click={this.changeModal}></ButtonRow> : null}
                                  {
                                    cols[e.id].map((task) => {
                                      let haveChilds = [];
                                      haveChilds = ObjTasks.filter((othrtask) => (othrtask.parentId === task.id));
                                      

                                      console.log(haveChilds);
                                      

                                      if (this.state.curParentId === task.id) {
                                        selectedChilds = showChilds;
                                      } else { selectedChilds = false; }

                                      return (
                                        <Task fulltask={task} showother={this.state.showChilds} status={e.id} key={task.id} id={task.id} selectedChilds={selectedChilds} selected={toTask && taskId === task.id ? toTask : null} name={task.name} endDate={task.endDate} lastMessage={task.lastMessage} click={this.toTask} childscol={haveChilds && haveChilds.length > 0 ? haveChilds : null} childs={haveChilds && haveChilds.length > 0 ? this.childs : null} deleteTask={this.changeDelModal} />
                                      )
                                    })
                                  }
                                </Column>
                              )
                            })
                          }
                        </ContentInner>
                      ) }

                    </ContentInner>

                    <Panel>

                      {toTask ? (
                        <TaskView taskId={this.state.taskId} objectId={this.state.objectId} data={taskData} />
                      ) : ( <TextRow name="Информация" view="Pad510 BigName">
                        <TextRow name="" view="Pad510 MT10">
                          {data.object.name}
                        </TextRow>
                        <TextRow name="" view="cgr Pad510 s">
                          {data.object.address.value}
                          <p>
                        "{data.object.address.coordinates[0]}, {data.object.address.coordinates[1]}"
                          </p>

                        </TextRow>
                        <TextRow name="" view="cgr Pad510 s">
                          Задачи: {data.object.tasks.length}
                        </TextRow>
                        <TextRow name="" view="cgr Pad510 s">
                        </TextRow>

                        <TextRow name="Документы" view="Pad510">
                          {
                            data.object ? (
                              <div>
                                {
                                  data.object.docs ? data.object.docs.map(
                                    (e)=>{
                                      return(
                                        <FileRow key={e.id} name={e.name} id={e.id} icon="doc" />
                                      )
                                    }
                                  ) : (
                                    <div>
                                      <FileRow name="Смета_проекта.doc" id="id1235" icon="doc" />
                                      <FileRow name="Фото подвала.jpg" id="id1237" icon="img" />
                                      <div className="FakeLink"><Link to="/docs">Показать все</Link></div>
                                    </div>
                                  )
                                }
                              </div>) : null
                          }
                        </TextRow>
                      </TextRow>)}

                    </Panel>
                  </Content>

                  {this.state.modalDelete? (
                    <Modal close={this.changeDelModal} size="350">
                          Удалить задачу?
                      <ButtonRow iconright="1" click={this.deleteTask}>Удалить</ButtonRow>
                    </Modal>
                  ) : null }
                  {this.state.modal ? (
                    <Modal close={this.closeModal} message={this.state.modalMessage?this.state.modalMessage:""}>
                      <ModalRow>
                        <ModalCol>
                          <InputWrapper placeholder="Введите название задачи" change={(name) => { this.saveTaskData(name, "name", true) }}>
                                  Название
                          </InputWrapper>
                        </ModalCol>
                      </ModalRow>
                      <ModalRow>
                        <ModalCol>
                          <ModalBlockName>
                                  Статус
                          </ModalBlockName>

                          <FakeSelect array={status} onselect={(e) => { this.saveTaskData(e, "status", false)}}>
                          </FakeSelect>

                        </ModalCol>
                        <ModalCol>
                        </ModalCol>
                      </ModalRow>

                      <ModalRow>
                        <ModalCol>
                          <div className="ModalBlockName">
                                Срок истечения
                          </div>
                          <label htmlFor="dateout" className="LabelInputDate">
                            <input type="date" name="dateout" placeholder="Дата Завершения" onChange={(e) => { this.saveTaskData(e.target.value, "endDate", true)}} />
                          </label>
                        </ModalCol>

                        <ModalCol>
                          <ModalBlockName>
                                Добавить родительскую задачу
                          </ModalBlockName>

                          <FakeSelect array={data.object.tasks} onselect={(e) => { this.saveTaskData(e, "parentId", true)}}>
                          </FakeSelect>
                          {/* <label htmlFor="parentSelect" className="LabelSelect"> */}
                          {/* <select name="parentSelect" onChange={(e)=>{this.writeTaskData(e.target.value, "parentId", true)}}>
                                    <option value="0">Выбрать задачу</option>
                                    {
                                      data.object.tasks.map((e)=>{
                                        return(
                                          <option key={e.id} value={e.id}>{e.name}</option>
                                        )
                                      })
                                    }
                                  </select> */}
                          {/* </label> */}
                        </ModalCol>
                      </ModalRow>
                      <ModalRow>
                        <ModalCol>
                          <div className="Button2" onClick={()=>this.writeTaskDataMaker()}>Создать задачу</div>
                        </ModalCol>

                      </ModalRow>
                    </Modal>
                  ) : null }
                </Fragment>
              )

            }else{
              return(<div className="errMess">
                Объект не найден
              </div>)
            }
          }}
        </Query>
      )
    }else{
      return(<Redirect to="/" />)
    }
  }
}

Board.propTypes = {
  setInfo: PropTypes.func.isRequired,
  rootId: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
  objectCacheUpdate: PropTypes.func.isRequired,
  location: PropTypes.object
};


export default compose(
  graphql(rootId, { name: 'rootId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(objectCacheUpdate, { name: 'objectCacheUpdate' }),
)(Board);




