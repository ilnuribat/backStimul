import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
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
import { getObjectTasks, glossaryStatus, TASKS_QUERY, checkObject } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
import '../../../newcss/boardview.css';
import '../../../newcss/task.css';
import { Svg } from '../../Parts/SVG/index';
import { ButtonRow, TextRow, FileRow } from '../../Parts/Rows/Rows';
import Modal, {InputWrapper, ModalRow, ModalCol, ModalBlockName} from '../../Lays/Modal/Modal';
import { updTask, crTask, deleteTask } from '../../../GraphQL/Qur/Mutation';
import Panel from '../../Lays/Panel/index';

// import { FakeSelect } from '../../Parts/FakeSelect/FakeSelect';

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      objectId:"",
      taskId:"",
      taskName: "",
      rootId: "",
      info:{name:"", id:""},
      status: [],
      toRoot: false,
      toTask: false,
      showChilds: false,
      modal: false,
      modalDelete: false,
      HaveObj: false,
      modalMessageShow: false,
      modalMessage: "",
      modalNameCreator: "",
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
    this.deleteTask = this.deleteTask.bind(this)
    this.changeDelModal = this.changeDelModal.bind(this)
    this.modalMessage = this.modalMessage.bind(this)
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
    let id = location.state && location.state.objectId ? location.state.objectId : localStorage.getItem('ObjectId')

    console.log("location.state ------------ ", location.state )

    
    if(id){
      this.setState({
        objectId: id,
      });
      this.chkObject(id)
      this.glossStatus(id)
    }
  }

  // componentDidMount(){
  //   const { location } = this.props;
  //   let id = location.state && location.state.objectId ? location.state.objectId : localStorage.getItem('ObjectId')

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

    console.warn("To TASK ID")
    console.warn(id)

    if(id){
      localStorage.setItem('grid', id)
      localStorage.setItem('grnm', name)
    }

    this.props.setChat({
      variables: {
        id: id,
        name: name,
        priv: false,
      }
    });

    this.setState({
      toTask: true,
      taskId: id,
      taskName: name
    })

  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location } = this.props;
    let id;

    if(prevProps.location.state == this.props.location.state) return false

    location.state && location.state.objectId ? id = location.state.objectId : id = localStorage.getItem('ObjectId')

    

    if(id){
      this.setState({
        objectId: id,
      });
      this.chkObject(id)
      this.glossStatus(id)
    }
  }
  shouldComponentUpdate(nextProps, nextState){

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
      taskId: "",
    })
  }

  glossStatus(){
    if (this.state.status.length === 0)
      qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
        this.setState({
          status: ["",...a.data.glossary.taskStatuses],
        });
      })
        .catch((e)=>{
          console.warn(e);
        });
  }

  deleteTask () {
    qauf(deleteTask(this.state.taskId), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("delete task done", a)
      this.props.objectCacheUpdate({
        variables:{
          action: "deleteTask",
          taskId: this.state.taskId,
          objectId: this.state.objectId
        }
      })
      this.changeDelModal("")
    }).catch((e)=>{
      console.warn(e);
    })
  }

  changeDelModal (id) {
    this.setState({
      taskId: id,
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

  writeTaskData(value, change, quota) {
    let cap = ""

    if (quota) cap = '"';

    let changes = `${change}: ${cap}${value}${cap}`;

    if (change !== "name"){
      changes = `name: "Нет названия", ${change}: ${cap}${value}${cap}`
    }

    if (!this.state.taskId)
      qauf(crTask(`{${changes}, objectId: "${this.state.objectId}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("create task done", a.data.createTask.id)
        this.props.objectCacheUpdate({
          variables:{
            value: {[change] : value},
            action: "createTask",
            taskId: a.data.createTask.id,
            objectId: this.state.objectId
          }
        })
        this.modalMessage("Изменения сохранены");
        this.setState({
          taskId: a.data.createTask.id,
        })
      }).catch((e)=>{
        this.modalMessage("Ошибка"+e);
        console.warn(e);
      })
    else
      qauf(updTask(this.state.taskId,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("update task done", a)
        this.modalMessage("Изменения сохранены");
        this.props.objectCacheUpdate({
          variables:{
            value: {value : value, key : change},
            action: "updateTask",
            taskId: this.state.taskId,
            objectId: this.state.objectId
          }
        })
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


  render(){
    const { objectId, status, taskId, toTask, taskName, showChilds, HaveObj } = this.state;
    const { setInfo } = this.props;


    // if(toRoot) return <Redirect to={{
    //   pathname: '/',
    //   state: { rootId: rootId }
    // }} />
    if(toTask) return <Redirect to={{
      pathname: '/task',
      state: { taskId: taskId, taskName: taskName, objectId: objectId }
    }} />

    // let o = this.checkObject(objectId);

    // let o = ()=>{
    //   let HaveName = false;
    //   qauf(checkObject(objectId), _url, localStorage.getItem('auth-token')).then(a=>{
    //     console.log("checkObject Name AAAAAAAAAAA", a);
    //     if(a && a.name){
    //       console.log("checkObject Name AAAAAAAAAANAME", a.name);
    //       HaveName = true;
    //       return true;
    //     }
    //   }).catch((e)=>{
    //     console.warn(e);
    //   })
    //   console.log("oooooooooooooooooooooo", HaveName)
    //   return await HaveName;
    // }
    

    // console.warn(" current states is", objectId, status)
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
              setInfo({variables:{id:"id",message:error.message, type:"error"}})
              console.warn('Error', error.message)

              return(
                "error"
              );
            }

            if(data && data.object){
              let selected = false;

              if (this.state.curParentId && this.state.showChilds)
              {
                data.object.tasks = data.object.tasks.filter((task) => (task.parentId === this.state.curParentId || task.id === this.state.curParentId))
              }
              // console.warn("DATA IS", data.object.tasks)

              let arr = _.sortBy(data.object.tasks, 'status');
              let cols = [[],[],[],[],[],[],[]];

              arr = _.sortBy(data.object.tasks, 'unreadCount');
              _.forEach(arr, (result)=>{
                if(!result.status){
                  cols[1].push(result);
                }
                if(result.status){
                  cols[result.status].push(result);
                }
              });

              return(
                <Fragment>
                  <Content>
                    <div className="Board">
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
                          {/* <p className="small">{data.object.id}</p> */}
                        </div>

                      </div>
                      <div className="Board-Content">
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
                                <InputWrapper placeholder="Введите название задачи" save="Сохранить" change={(name)=>{this.setState({ modalNameCreator: name })}}>
                                  Название
                                </InputWrapper>
                              </ModalCol>
                              </ModalRow>
                              <ModalRow>
                              <ModalCol>
                                <ModalBlockName>
                                  Статус
                                </ModalBlockName>
                                <label htmlFor="selectStatus" className="LabelSelect">
                                  <select name="selectStatus" onChange={(e)=>{this.writeTaskData(e.target.value, "status", false)}} >
                                    {/* <option value="0">Выбрать статус</option> */}
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
                            </ModalRow>

                            <ModalRow>
                              <ModalCol>
                                <div className="ModalBlockName">
                                Срок истечения
                                </div>
                                <label htmlFor="dateout" className="LabelInputDate">
                                  <input type="date" name="dateout" placeholder="Дата Завершения" onChange={(e)=>{this.writeTaskData(e.target.value, "endDate", true)}} />
                                </label>
                              </ModalCol>

                              <ModalCol>
                                <ModalBlockName>
                                Добавить родительскую задачу
                                </ModalBlockName>
                                <label htmlFor="parentSelect" className="LabelSelect">
                                  <select name="parentSelect" onChange={(e)=>{this.writeTaskData(e.target.value, "parentId", true)}}>
                                    <option value="0">Выбрать задачу</option>
                                    {
                                      data.object.tasks.map((e)=>{
                                        return(
                                          <option key={e.id} value={e.id}>{e.name}</option>
                                        )
                                      })
                                    }
                                  </select>
                                </label>
                              </ModalCol>
                            </ModalRow>
                            <ModalRow>
                            <ModalCol>
                              <div className="Button3" onClick={this.writeTaskData(this.state.modalNameCreator, 'name', true)}>Сохранить</div>
                            </ModalCol>

                            </ModalRow>
                          </Modal>
                        ) : null }
                        {/* {console.warn("status2",status)} */}
                        {
                          status && status.map((e,i)=>{
                            if( i === 0 ){
                              return(true)
                            }

                            return(
                              <Column key={e.id} id={e.id} status={e.name} name={e.name} >
                                {e.id == 1 ? <ButtonRow icon="plus" view="MiniBox" iconright="1" click={this.changeModal}></ButtonRow>  : null}
                                {
                                  cols[e.id].map((task)=>{
                                    if(this.state.curParentId === task.id ){
                                      selected = showChilds;
                                    } else { selected = false; }

                                    return(
                                      <Task showother={this.state.showChilds} key={task.id} id={task.id} selected={selected} name={task.name} endDate={task.endDate} lastMessage={task.lastMessage} click={this.toTask} childs={this.childs} deleteTask={this.changeDelModal}/>
                                    )
                                  })
                                }
                              </Column>
                            )
                          })
                        }
                      </div>
                    </div>
                  </Content>
                  <Panel>
                    <TextRow name="Информация" view="Pad510 BigName">
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
                    Задачи: {data.object.tasks.length} штуки
                      </TextRow>
                      <TextRow name="" view="cgr Pad510 s">
                      </TextRow>

                      <TextRow name="Документы" view="Pad510">
                        {
                          data.object ? (
                            <div>
                              {
                                data.object.docs ? data.object.docs.map(
                                  (e,i)=>{
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
                    </TextRow>



                  </Panel>
                </Fragment>
              )

            }else{
              console.log("Data and error",data, error)
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


