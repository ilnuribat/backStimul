import React, { Component } from 'react';
import { graphql, compose } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'animate.css';
import { TASKS_QUERY, glossaryStatus, setPrivateChat, getObjectTasks, getObjectId} from '../graph/querys';
import { qauf, _url } from '../constants';
import Column from './BoardParts/Column';
import DataQuery from './BoardParts/DataQuery';
import Loading from './Loading';
// import anime from 'animejs';

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    this.getCurrentTasks = this.getCurrentTasks.bind(this)
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

    this.glossStatus();
    this.getCurrentTasks("5bd9b336b598050c608f94d3");
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

  getCurrentTasks(id){
    qauf(getObjectTasks(id), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        tasks: a.data.object.tasks
      });
      console.warn(a.data.object.tasks)
    })
      .catch((e)=>{
        console.warn(e);
      });
  }

  render(){
    const { getObjectId } = this.props

    if (!getObjectId.currentObjectId) {
      return null
    }

    let { status, tasks } = this.state;

    let cols = [[],[],[],[],[],[],[]];

    if(!status) return <Loading />;
    if(!tasks) return <Loading />;

    const arr = _.sortBy(tasks, 'unreadCount');

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
      return(
        "Нет данных"
      )
    }

  }
}


Board.propTypes = {
  getObjectId: PropTypes.object.isRequired,
  setPrivateChat: PropTypes.func.isRequired
};



export default compose(
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(setPrivateChat, { name: 'setPrivateChat' }),
)(Board);
