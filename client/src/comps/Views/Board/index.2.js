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
import { getObjectId, setChat, setInfo, setObjectId, rootId } from '../../../GraphQL/Cache';
import { getObjectTasks, glossaryStatus, TASKS_QUERY, ObjectInfo } from '../../../GraphQL/Qur/Query';
import Content from '../../Lays/Content';
import '../../../newcss/boardview.css';
import '../../../newcss/task.css';
import { Svg } from '../../Parts/SVG/index';
import { Link } from 'react-router-dom';

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      _id:"",
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
    let { getObjectId, setObjectId } = this.props;



    console.log("_______________BOARD__________________0")
    console.log(getObjectId.currentObjectId, localStorage.getItem('ObjectId'))



    console.log("_______________BOARD__________________1")

    if(getObjectId.currentObjectId || localStorage.getItem('ObjectId')){
      console.log("_______________BOARD__________________2");
      let id = getObjectId.currentObjectId || localStorage.getItem('ObjectId');
      this.props.setObjectId({
        variables:{
          id: id,
          name: "",
        }
      });
      console.log("_______________BOARD__________________3");
      console.log("ID",id);
      if(id){
        this.setState({
          _id: id,
        });
      }


      console.log("_______________BOARD__________________4");
    }
    // else{
    //   this.props.setObjectId({
    //     variables:{
    //       id: localStorage.getItem('ObjectId'),
    //       name: "",
    //     }
    //   });
    //   this.setState({
    //     _id: getObjectId.currentObjectId,
    //   })
    // }
    // if(!getObjectId.currentObjectId) {

    //   console.log("a")
    //   console.log(getObjectId)
    //   // this.setState({
    //   //   toRoot: true,
    //   // })
    //   // return false;
    // }
    // console.log("_______________BOARD__________________5")
    // let ObjId = localStorage.getItem('ObjectId') || getObjectId.currentObjectId;

    
    // console.log("_______________BOARD__________________6")
    // this.props.setChat({
    //   variables: {
    //     id: "",
    //     name: "",
    //     priv: false,
    //     unr: 0,
    //   }
    // })

  }

  toBack(id){
    console.log("TO BACK",id);

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

    console.log("To TASK ID")
    console.log(id)


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

  glossStatus(id){
    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      console.log("_______________BOARD__________________7")
      this.setState({
        status: ["",...a.data.glossary.taskStatuses],
      });
      console.log("_______________BOARD__________________8")
    })
      .catch((e)=>{
        console.log("_______________BOARD__________________9")
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
    const { getObjectId, setObjectId } = this.props;
    const { _id, info, toRoot, status, tasks, toTask } = this.state;
    let cols = [[],[],[],[],[],[],[]];

    // if (!_id) {
    //   return <Redirect to="/" />
    // }

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


    if(toRoot) return <Redirect to="/" />;
    if(toTask) return <Redirect to="/task" />;


    if(_id && status){
      return (
        <Content>
          <Query query={getObjectTasks} variables={{ id: _id}} >
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
                console.log('Error', error.message)
                return(
                  "error"
                  // <Redirect to="/" />
                );
              }
              if(data && data.object){
                let FullData = data.object;
                let Changed;
              


              let arr = _.sortBy(FullData.tasks, 'status');

              arr = _.sortBy(FullData.tasks, 'unreadCount');


              _.forEach(arr, (result)=>{
                if(!result.status){
                  cols[1].push(result);
                }
                if(result.status){
                  cols[result.status].push(result);
                }
              });

              console.log("cols",cols)



                console.log("data",data)

                return(
                  <div className="Board">
                    <div className="Board-Top">
                      {
                        FullData.parentId ? (<div className="toBack" onClick={()=>{this.toBack(FullData.parentId)}}><Link to="/tile"><Svg svg="back" /></Link></div>) : null
                      }
                      <h1>{FullData.name}</h1>
                      {/* <p className="small">{info.id}</p> */}
                    </div>
                    <div className="Board-Content">
                      {console.log("status2",status)}
                      {
                        status && status.map((e,i)=>{
                          if( i === 0 ){
                            return(true)
                          }

                          this.state.curParentId && this.state.showChilds ? data.object.tasks = data.object.tasks.filter((task) => (task.parentId === this.state.curParentId || task.id === this.state.curParentId))  : null;

                          // if(Changed && Changed.length > 0){
                          //   console.log("Changed")
                          //   console.log(Changed)
                          //   // FullData.tasks = [...Changed];
                          //   try{


                          //     // Object.defineProperty(FullData, 'tasks', {
                          //     //   enumerable: true,
                          //     //   configurable: true,
                          //     //   writable: true,
                          //     //   value: Changed,
                          //     // });
                          //   }catch(e){
                          //     console.log(e)
                          //   }

                          // }


                          return(
                            <Column key={e.id} id={e.id} status={e.name} name={e.name} >
                              {


                                cols[e.id].map((task, i)=>{
                                  let hide = false;
                                  if(Changed){
                                    var find_id = _.result(_.find(Changed, function(obj){
                                      return obj.id === task.id;
                                  }), 'id');

                                    console.log("Changed");
                                    console.log(Changed);
                                    console.log("find_id");
                                    console.log(find_id);

                                    if(!find_id){
                                      hide = true;
                                    }else{
                                      hide = false;
                                    }
                                }
                                  // let {children, name, id, endDate, lastMessage, click, childs} = task;

                                  // return( 
                                  //       <div className="Task" >
                                  //       <div style={{"display":"none"}}>
                                  //         {
                                  //           id
                                  //         }
                                  //       </div>
                                  //       <div className="Name" onClick={()=>click(id, name)}>
                                  //         {
                                  //           name
                                  //         }
                                  //       </div>
                                  //       {
                                  //         endDate ? (
                                  //           <div className="endDate">
                                  //               истекает:
                                  //             {endDate}
                                  //           </div>
                                  //         ): null
                                  //       }
                            
                                  //       {
                                  //         lastMessage ? (
                                  //           <div className="TaskChat">
                                  //             <div className="ChatName">
                                  //               {
                                  //                 lastMessage.from.username
                                  //               }
                                  //             </div>
                                  //             <div className="ChatMessage">
                                  //               {
                                  //                 lastMessage.text
                                  //               }
                                  //             </div>
                            
                                  //           </div>
                                  //         ) : null
                                  //       }
                                  //       <div className="Bottom">
                                  //         <div className="TaskUserPhoto"></div>
                                  //         <div className="Childs" onClick={()=>this.childs(id)}>
                                  //           <Svg svg="deps"></Svg>
                                  //         </div>
                                  //       </div>
                                  //       <div className="linked" onClick={()=>this.click(id, name)}>
                                  //         открыть
                                  //       </div>
                                  //       </div>
                                  // )
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
        console.log("status")
        this.glossStatus(_id);
        return <Loading/>
    }
    
    // else{
    //   return <Redirect to="/" />
    // }

  }
}


Board.propTypes = {
  getObjectId: PropTypes.object.isRequired,
};


export default compose(
  graphql(rootId, { name: 'rootId' }),
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(setObjectId, { name: 'setObjectId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setChat, { name: 'setChat' }),
)(Board);
