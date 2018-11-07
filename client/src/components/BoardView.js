import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'animate.css';
import { TASKS_QUERY, glossaryStatus, setPrivateChat, getObjectTasks, getObjectId, setObjectId, getObjectInfo, setInfo,ObjectInfo} from '../graph/querys';
import { qauf, _url } from '../constants';
import Column from './BoardParts/Column';
import DataQuery from './BoardParts/DataQuery';
import Loading from './Loading';
// import anime from 'animejs';

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name:"",
      info:{name:"", id:""},
      input: [],
      status: [],
      tasks: {},
      columns: [
        "Null",
        "Новые",
        "В работе",
        "На проверке",
        "Завершенные",
      ],
    };

    this.daTa = this.daTa.bind(this)
    this.selectTask = this.selectTask.bind(this)
    this.glossStatus = this.glossStatus.bind(this)
    // this.getCurrentTasks = this.getCurrentTasks.bind(this)
  }

  daTa(){ return(<DataQuery query={TASKS_QUERY}/>) }

  selectTask(e){
    this.props.setPrivateChat({
      variables: {
        id: e.id,
        name: e.name,
        priv: false,
        unr: 0,
      }
    });
  }

  componentDidMount(){
    // const { getObjectId } = this.props
    // console.warn("AAA" , getObjectId)
    // this.getCurrentTasks("5bd9b336b598050c608f94d3");
    this.glossStatus();
    this.props.setPrivateChat({
      variables: {
        id: "",
        name: "",
        priv: false,
        unr: 0,
      }
    })

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

  // getCurrentTasks(id){
  //   qauf(getObjectTasks(id), _url, localStorage.getItem('auth-token')).then(a=>{
  //     this.setState({
  //       tasks: a.data.object.tasks
  //     });
  //     console.warn(a.data.object.tasks)
  //   })
  //     .catch((e)=>{
  //       console.warn(e);
  //     });
  // }
  about(id){

    console.log("id----------")
    console.log(id)
    this.props.setInfo({variables:{id:"id",message:id, type:"error"}});

    

    qauf(ObjectInfo(id), _url, localStorage.getItem('auth-token'))
    .then(a=>{

      console.log("a.object.name");
      console.log(a);
      console.log(a.data.object.name);

      let info = {};

      info.id = id;
      info.name = a.data.object.name;

      console.log(info)

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
    const { info } = this.state;
    console.log(info)
    if (!getObjectId.currentObjectId) {

      let id = localStorage.getItem('back');
      this.props.setObjectId({
        variables:{
          id: id,
          priv: false,
        }
      });

      this.about(id)

      // return null
    }else{
      this.about(getObjectId.currentObjectId)
    }

    let { status, tasks } = this.state;

    let cols = [[],[],[],[],[],[],[]];

    if(!status) return <Loading />;

    return (
      <Fragment>
        <div className="top-name">
          <h1>{info.name}</h1>
          <p>{info.id}</p>
        </div>
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
            return (
              true
            );
          }
          if(data &&  data.object && data.object.tasks){
            console.warn("data is", data.object.tasks)
            if(!tasks) return <Loading />;

            const arr = _.sortBy(data.object.tasks, 'unreadCount');

            _.forEach(arr, (result)=>{
              if(!result.status){
                cols[1].push(result);
              }
              if(result.status){
                cols[result.status].push(result);
              }
            });

            if(status){
              return(
                <div id="anim" className="content-aft-nav columns-wrapper">

                  {
                    status && status.map((e,i)=>{
                      if(!e.name){
                        return true;
                      }

                      return <Column data-simplebar key={"column"+e.id} name={e.name} tasks={cols[i]} selectTask={this.selectTask} first={i===1 ? (1) : (0)} />
                    })
                  }
                </div>
              )
            }else{

              this.props.setInfo({variables:{id:"id",message:"Нет данных", type:"error"}})
              return true;
            }
          }
        }
        }
      </Query>
      </Fragment>
    )
  }
}


Board.propTypes = {
  getObjectId: PropTypes.object.isRequired,
  setPrivateChat: PropTypes.func.isRequired
};


export default compose(
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(setObjectId, { name: 'setObjectId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setPrivateChat, { name: 'setPrivateChat' }),
)(Board);
