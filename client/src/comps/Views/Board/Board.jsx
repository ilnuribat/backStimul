import React, { Component } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import 'animate.css';
import Column from '../../Parts/Column';
import Task from '../../Parts/Task';
import DataQuery from '../../Parts/DataQuery';
import Loading from '../../Loading';
import { qauf, _url } from '../../../constants';
import { setChat, setInfo, rootId } from '../../../GraphQL/Cache';
import { getObjectTasks, glossaryStatus, TASKS_QUERY } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
import '../../../newcss/boardview.css';
import '../../../newcss/task.css';
import { Svg } from '../../Parts/SVG/index';
import { ButtonRow, TextRow, FileRow } from '../../Parts/Rows/Rows';
import Modal, {InputWrapper, ModalRow, ModalCol, ModalBlockName} from '../../Lays/Modal/Modal';
import { updTask, crTask, deleteTask } from '../../../GraphQL/Qur/Mutation';
import Panel from '../../Lays/Panel/index';
import { Fragment } from 'react';
// import { FakeSelect } from '../../Parts/FakeSelect/FakeSelect';

let ref;

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
      modalDelete: false
    };

    this.daTa = this.daTa.bind(this)
    this.selectTask = this.selectTask.bind(this)
    this.glossStatus = this.glossStatus.bind(this)
    this.childs = this.childs.bind(this)
    this.toTask = this.toTask.bind(this)
    this.toBack = this.toBack.bind(this)

    this.changeModal = this.changeModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.writeTaskName = this.writeTaskName.bind(this)
    this.writeTaskData = this.writeTaskData.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.changeDelModal = this.changeDelModal.bind(this)
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

  componentDidMount(){
    const { location } = this.props;
    let id;

    (location.state && location.state.objectId) ? id = location.state.objectId : id = localStorage.getItem('ObjectId')

    if(id){
      this.setState({
        objectId: id,
      });
    }
  }

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
    ref()
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
      this.changeDelModal()
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

  writeTaskName(name) {
    // console.warn("writeName", name, this.state.taskId)
    if (!this.state.taskId)
      qauf(crTask(`{name: "${name}", objectId: "${this.state.objectId}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("create task done", a.data.createTask.id)
        this.setState({
          taskId: a.data.createTask.id,
        })
      }).catch((e)=>{
        console.warn(e);
      })
    else
      qauf(updTask(this.state.taskId,`{name: "${name}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("update task done", a)
      }).catch((e)=>{
        console.warn(e);
      })
  }

  writeTaskData(e, change, quota) {
    let cap = ""
    const value = e.target.value

    if (quota) cap = '"';
    // console.warn("writeData", e, change, this.state.taskId)

    if (!this.state.taskId)
      qauf(crTask(`{name: "Нет названия", ${change}: ${cap}${value}${cap}, objectId: "${this.state.objectId}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("create task done", a.data.createTask.id)
        this.setState({
          taskId: a.data.createTask.id,
        })
      }).catch((e)=>{
        console.warn(e);
      })
    else
      qauf(updTask(this.state.taskId,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
        console.warn("update task done", a)
      }).catch((e)=>{
        console.warn(e);
      })
  }


  render(){
    const { objectId, status, taskId, toTask, taskName, showChilds } = this.state;
    const { setInfo } = this.props;
    let cols = [[],[],[],[],[],[],[]];

    // if(toRoot) return <Redirect to={{
    //   pathname: '/',
    //   state: { rootId: rootId }
    // }} />
    if(toTask) return <Redirect to={{
      pathname: '/task',
      state: { taskId: taskId, taskName: taskName, objectId: objectId }
    }} />

    if(objectId && status){
      return (
        <Query query={getObjectTasks} variables={{ id: objectId}} >
          {({ loading, error, data, refetch }) => {
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

              ref = refetch

              if (this.state.curParentId && this.state.showChilds)
              {
                data.object.tasks = data.object.tasks.filter((task) => (task.parentId === this.state.curParentId || task.id === this.state.curParentId))
              }
              console.warn("DATA IS", data.object.tasks)

              let arr = _.sortBy(data.object.tasks, 'status');

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
                          <Modal close={this.closeModal}>
                            <InputWrapper name="Ведите название задачи" save="Сохранить" click={this.writeTaskName}>
                      Название
                            </InputWrapper>

                            <ModalRow>
                              <ModalCol>
                                <ModalBlockName>
                          Статус
                                </ModalBlockName>
                                <label htmlFor="">
                                  <select onChange={(e)=>{this.writeTaskData(e, "status", false)}} >
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
                                <label htmlFor="">
                                  <input type="date" placeholder="Дата Завершения" onChange={(e)=>{this.writeTaskData(e, "endDate", true)}} />
                                </label>
                              </ModalCol>

                              <ModalCol>
                                <ModalBlockName>
                                Добавить родительскую задачу
                                </ModalBlockName>
                                <label htmlFor="">
                                  <select onChange={(e)=>{this.writeTaskData(e, "parentId", true)}}>
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
                                {
                                  cols[e.id].map((task)=>{
                                    if(this.state.curParentId === task.id ){
                                      selected = showChilds;
                                    } else { selected = false; }

                                    return(
                                      <Task key={task.id} id={task.id} selected={selected} name={task.name} endDate={task.endDate} lastMessage={task.lastMessage} click={this.toTask} childs={this.childs} deleteTask={this.changeDelModal}/>
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
                        {
                          console.log(data.object)
                        }
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

            }
          }}
        </Query>
      )
    }else{
      // console.warn("status")
      this.glossStatus(objectId);

      return <Loading/>
    }
  }
}



Board.propTypes = {
  setInfo: PropTypes.func.isRequired,
  rootId: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object
  }),
};


export default compose(
  graphql(rootId, { name: 'rootId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setChat, { name: 'setChat' }),
)(Board);
