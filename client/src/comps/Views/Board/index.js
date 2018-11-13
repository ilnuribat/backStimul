import React, { Component, Fragment } from 'react';
import { graphql, compose, Query } from "react-apollo";
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'animate.css';

import Column from '../../Parts/Column';
import DataQuery from '../../Parts/DataQuery';
import Loading from '../../Loading';
import { qauf, _url } from '../../../constants';
import { getObjectId, setChat, setInfo, setObjectId } from '../../../GraphQL/Cache';
import { getObjectTasks, glossaryStatus, TASKS_QUERY, ObjectInfo } from '../../../GraphQL/Qur/Query';
import { Redirect } from 'react-router';
import Content from '../../Lays/Content';



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

    if(!getObjectId.id) {
      // this.setState({
      //   toRoot: true,
      // })
      return false;
    }

    let ObjId = localStorage.getItem('ObjectId') || getObjectId.id;

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
    const { info, toRoot, status, tasks } = this.state;
    let cols = [[],[],[],[],[],[],[]];

    if (!getObjectId.id) {
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
    if(!!getObjectId.id){
      return (
        <Content>
          <div className="Board-Top">
            <h1>{info.name}</h1>
            {/* <p className="small">{info.id}</p> */}
          </div>
          <Query query={getObjectTasks} variables={{ id: getObjectId.id }} >
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
              if(data && data.object && data.object.tasks){
                console.log(data)
                return "Data"
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
