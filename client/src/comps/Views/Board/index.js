import React, { Component, Fragment } from 'react';
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
import { setChat, setInfo, setObjectId, rootId } from '../../../GraphQL/Cache';
import { getObjectTasks, glossaryStatus, TASKS_QUERY } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
import '../../../newcss/boardview.css';
import '../../../newcss/task.css';
import { Svg } from '../../Parts/SVG/index';


class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      objectId:"",
      taskId:"",
      taskName: "",
      name:"",
      info:{name:"", id:""},
      input: [],
      status: [],
      tasks: {},
      toRoot: false,
      toTask: false,
      columns: [
        "Null",
        "Новые",
        "В работе",
        "На проверке",
        "Завершенные",
      ],
      showChilds: false,
    };

    this.daTa = this.daTa.bind(this)
    this.selectTask = this.selectTask.bind(this)
    this.glossStatus = this.glossStatus.bind(this)
    this.childs = this.childs.bind(this)
    this.toTask = this.toTask.bind(this)
    this.toBack = this.toBack.bind(this)
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
    const { setObjectId, location } = this.props;

    if(location.state.objectId || localStorage.getItem('ObjectId')){

      const id =location.state.objectId  || localStorage.getItem('ObjectId') ;

      setObjectId({
        variables:{
          id: id,
          name: "",
        }
      });

      if(id){
        this.setState({
          objectId: id,
        });
      }
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

  toTask(id, name, parentId){

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

  glossStatus(id){
    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("_______________BOARD__________________7")
      this.setState({
        status: ["",...a.data.glossary.taskStatuses],
      });
      console.warn("_______________BOARD__________________8")
    })
      .catch((e)=>{
        console.warn("_______________BOARD__________________9")
        console.warn(e);
      });
  }

  // about(id){

  //   qauf(ObjectInfo(id), _url, localStorage.getItem('auth-token'))
  //     .then(a=>{

  //       let info = {};

  //       info.id = id;
  //       info.name = a.data.object.name;

  //       if(this.state.info.id == id && this.state.info.name == a.data.object.name){return true}
  //       else{
  //         this.setState({
  //           info: info,
  //         });

  //       }

  //     })
  //     .catch((e)=>{
  //       console.warn(e);
  //     });
  // }

  render(){
    const { objectId, info, toRoot, status, taskId, toTask, taskName } = this.state;
    let cols = [[],[],[],[],[],[],[]];

    if(toRoot) return <Redirect to="/" />;
    if(toTask) return <Redirect to={{
      pathname: '/task',
      state: { taskId: taskId, taskName: taskName, objectId: objectId }
    }} />

    if(objectId && status){
      return (
        <Content>
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
                this.props.setInfo({variables:{id:"id",message:error.message, type:"error"}})
                console.warn('Error', error.message)

                return(
                  "error"
                  // <Redirect to="/" />
                );
              }
              if(data && data.object){


                this.state.curParentId && this.state.showChilds ? data.object.tasks = data.object.tasks.filter((task) => (task.parentId === this.state.curParentId || task.id === this.state.curParentId))  : null


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

                console.warn("cols",cols)



                console.warn("data",data)

                return(
                  <div className="Board">
                    <div className="Board-Top">
                      {
                        data.object.parentId ? (<div className="toBack" onClick={()=>{this.toBack(data.object.parentId)}}><Link to="/tile"><Svg svg="back" /></Link></div>) : null
                      }
                      <h1>{data.object.name}</h1>
                      <p className="small">{info.id}</p>
                    </div>
                    <div className="Board-Content">
                      {console.warn("status2",status)}
                      {
                        status && status.map((e,i)=>{
                          if( i === 0 ){
                            return(true)
                          }

                          return(
                            <Column key={e.id} id={e.id} status={e.name} name={e.name} >
                              {
                                cols[e.id].map((task, i)=>{
                                  return(
                                    <Task key={task.id} id={task.id} name={task.name} endDate={task.endDate} lastMessage={task.lastMessage} click={this.toTask} childs={this.childs}/>
                                  )
                                })
                              }
                            </Column>
                          )
                        })
                      }
                    </div>
                  </div>
                )

                // return "Data"
              }else{
                return "data"
              }

            }}
          </Query>
        </Content>
      )
    }else{
      console.warn("status")
      this.glossStatus(objectId);

      return <Loading/>
    }
  }
}


export default compose(
  graphql(rootId, { name: 'rootId' }),
  graphql(setObjectId, { name: 'setObjectId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setChat, { name: 'setChat' }),
)(Board);
