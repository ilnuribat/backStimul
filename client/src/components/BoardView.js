import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'animate.css';
import { TASKS_QUERY, glossaryStatus, setPrivateChat, getObjectTasks, getObjectTasks2, getObjectId, setObjectId, getObjectInfo, setInfo,ObjectInfo} from '../graph/querys';
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
      currentObjectId: ""
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

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps != this.props){
      if (!_.isEqual(nextProps.getObjectId, this.props.getObjectId) && nextProps.getObjectId.currentObjectId != "") {
        // console.warn("getObjectId", _.isEqual(nextProps.getObjectId, this.props.getObjectId));
        // console.warn("setPrivateChat", _.isEqual(nextProps.setInfo, this.props.setPrivateChat));

        // console.warn("nextProps", nextProps);
        // console.warn("props", this.props);
        return true

      }
    }
    if(nextState != this.state){

      if (!_.isEqual(nextState.info, this.props.info) && nextState.info.id != "" && nextState.status.length > 1) {
        console.warn("nextSTate", nextState);
        console.warn("state", this.state);

        return true
      }
    }

    return false

  }
  componentDidMount(){
    this.glossStatus();
  }

  componentWillUpdate () {
    const { getObjectId } = this.props

    console.warn("AAA" , getObjectId.currentObjectId.length)
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

  getCurrentTasks(id){
    qauf(getObjectTasks2(id), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        tasks: a.data.object.tasks
      });
      console.warn(a.data.object.tasks)
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
    const { info } = this.state;

    console.warn("BBBBB");

    if (!getObjectId.currentObjectId) {

      let id = localStorage.getItem('back');

      setObjectId({
        variables:{
          id: id,
          priv: false,
        }
      });

      this.about(id)

      return <Loading />

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
          {/* <p className="small">{info.id}</p> */}
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
              console.log(error)

              return(
                <div className="mess">
                  {error.message}
                </div>
              )

              let mess = 0;

              if(mess === 0){
                this.props.setInfo({variables:{id:"id",message:`Данные не получены! ${error.message}`, type:"error"}});
                // this.setState({
                //   rootId: "",
                // });
                mess = 1;
              }
            }
            if(data &&  data.object && data.object.tasks){

              console.log(data)

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

                let mess = 0;

                if(mess === 0){
                  this.props.setInfo({variables:{id:"id",message:`Данные не получены! ${error.message}`, type:"error"}});
                  this.setState({
                    rootId: "",
                  });
                  mess = 1;
                }

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
  setPrivateChat: PropTypes.func.isRequired,
  setObjectId: PropTypes.func.isRequired
};


export default compose(
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(setObjectId, { name: 'setObjectId' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(setPrivateChat, { name: 'setPrivateChat' }),
)(Board);
