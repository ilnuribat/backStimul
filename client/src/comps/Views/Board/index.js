import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'animate.css';

import { Redirect } from 'react-router';
import Column from '../../Parts/Column';
import Task from '../../Parts/Task';
import DataQuery from '../../Parts/DataQuery';
import Loading from '../../Loading';
import { qauf, _url } from '../../../constants';
import { getObjectId, setChat, setInfo, setObjectId } from '../../../GraphQL/Cache';
import { getObjectTasks, glossaryStatus, TASKS_QUERY, ObjectInfo } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
import '../../../newcss/boardview.css';
import '../../../newcss/task.css';
import { Svg } from '../../Parts/SVG/index';


class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    // this.props.glossStatus
    const { getObjectId, setObjectId } = this.props;

    if(getObjectId.currentObjectId && getObjectId.currentObjectName){
      this.setState({
        info: {id:getObjectId.currentObjectId, name: getObjectId.currentObjectName },
      })
    }
    if(!getObjectId.currentObjectId) {

      console.log("a")
      console.log(getObjectId)
      // this.setState({
      //   toRoot: true,
      // })
      // return false;
    }
    let ObjId = localStorage.getItem('ObjectId') || getObjectId.currentObjectId;

    this.glossStatus();
    this.props.setChat({
      variables: {
        id: "",
        name: "",
        priv: false,
        unr: 0,
      }
    })

  }

  toTask(id, name, parentId){

    console.log("To TASK ID")
    console.log(id)
    this.props.setChat({
      variables: {
        id: id,
        name: name,
        priv: false,
      }
    });
    
    this.setState({
      toTask: true,
    })

  }

  childs(id){
    console.log(id)
    if(id){
      this.setState({
        showChilds: !this.state.showChilds,
        curParentId: id
      });
    }
    // console.log("THIS CHILDS")
    // console.log(id)

  }

  glossStatus(){
    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        status: ["",...a.data.glossary.taskStatuses]
      });
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  about(id){

    qauf(ObjectInfo(id), _url, localStorage.getItem('auth-token'))
      .then(a=>{

        let info = {};

        info.id = id;
        info.name = a.data.object.name;

        if(this.state.info.id == id && this.state.info.name == a.data.object.name){return true}
        else{
          this.setState({
            info: info,
          });

        }

      })
      .catch((e)=>{
        console.warn(e);
      });


  }

  render(){
    const { getObjectId, setObjectId } = this.props;
    const { info, toRoot, status, tasks, toTask } = this.state;
    let cols = [[],[],[],[],[],[],[]];

    if (!getObjectId.currentObjectId) {
      return <Redirect to="/" />
    }

    // if(false){
    //   let id = localStorage.getItem('back');
    //   this.props.setObjectId({
    //     variables:{
    //       id: id,
    //       priv: false,
    //     }
    //   });

    //   this.about(id)

    // }else{
    //   this.about(getObjectId.currentObjectId)
    // }

    if(!status) return <Loading />;
    if(toRoot) return <Redirect to="/" />;
    if(toTask) return <Redirect to="/task" />;
    if(getObjectId.currentObjectId){
      return (
        <Content>
          <Query query={getObjectTasks} variables={{ id: getObjectId.currentObjectId }} >
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

                return(
                  <Redirect to="/" />
                );
              }

              this.state.showChilds ? data.object.tasks = data.object.tasks.filter((task) => (task.parentId === this.state.curParentId || task.id === this.state.curParentId))  : null


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

              console.log(cols)


              if(data && data.object){
                console.log(data)

                return(
                  <div className="Board">
                    <div className="Board-Top">
                      {
                        data.object.parentId ? (<div className="toBack" onClick={()=>{console.log("PARENT", data.object.parentId)}}><Svg svg="back" /></div>) : null
                      }
                      <h1>{data.object.name}</h1>
                      {/* <p className="small">{info.id}</p> */}
                    </div>
                    <div className="Board-Content">
                      {console.log(status)}
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
      return <Redirect to="/" />
    }

  }
}


Board.propTypes = {
  getObjectId: PropTypes.object.isRequired,
};


export default compose(
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(setObjectId, { name: 'setObjectId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setChat, { name: 'setChat' }),
)(Board);
