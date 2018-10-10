import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose, Query  } from "react-apollo";
import { TASKS_QUERY, getPrivateChat, setPrivateChat } from '../graph/querys';
import { Redirect } from 'react-router-dom';
import { qauf, _url } from '../constants';
import _ from 'lodash';
import 'animate.css';
import New from './New';


let r;

const Column = ({...props})=>{
  return(
    <div className="column animated fadeIn">
      <div className="column-name">{props.name}</div>
      <div className="column-content">
        {
          props.tasks.map((e,i)=>{
            let obj = {id: e.id, name: e.name }

            return(
              <div key={e.id} className="task animated fadeIn">
                <Link to="/">
                  <div className="head-link" onClick={()=>props.selectTask(obj)} data-id={e.id} taskid={e.id}>{e.name}</div>
                </Link>  
                
                <div className="small">{e.id}</div>
                <div className="lastMessage">{e.lastMessage.from.username}: {e.lastMessage.text}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
};

const DataQuery = ({...props})=>{
  return(
    <Query query={props.query} variables={props.vars}>
      {({ loading, error, data }) => {
      // if (loading) return "Loading...";
      // if (error) return `Error! ${error.message}`;

        console.log(data);

        return data.user.groups;

      }}
    </Query>
  )

  // return(
  //     <Query query={props.query} variables={props.vars}>
  //       {({ loading, error, data }) => {
  //         if (loading) return "Loading...";
  //         if (error) return `Error! ${error.message}`;

  //         console.log(data);

  //         return (
  //           true
  //         );
  //       }}
  //     </Query>
  //   )
};



class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: [],
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

    this.props.setChat({
      variables: {
        id: "",
        name: "",
        priv: false,
        unr: 0,
      }
    })

  }

  

  render(){

    if(r){
      r();
    }

    let { daTa } = this.state;
    let { getChat } = this.props;
    let cols = [[],[],[],[],[],[],[]];
    

    return(
      <Query query={TASKS_QUERY}>
        {({ loading, error, data, refetch }) => {
          r = refetch;
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          if(data && data.user && data.user.groups){
  
            console.log(data.user.groups);
            let arr = data.user.groups;
  
            arr = _.sortBy(arr, 'unreadCount');
  
            // let i = 1;
  
            _.forEach(arr, (result)=>{
              if(!result.status){
                cols[1].push(result);
              }
              if(result.status){
                cols[result.status].push(result);
              }
            });

            return(
              <div className="content-aft-nav columns-wrapper">
                <Column key={this.state.columns[1]} name={this.state.columns[1]} tasks={cols[1]} selectTask={this.selectTask} />
                <Column key={this.state.columns[2]} name={this.state.columns[2]} tasks={cols[2]} selectTask={this.selectTask} />
                <Column key={this.state.columns[3]} name={this.state.columns[3]} tasks={cols[3]} selectTask={this.selectTask} />
                <Column key={this.state.columns[4]} name={this.state.columns[4]} tasks={cols[4]} selectTask={this.selectTask} />
                <Column key={this.state.columns[5]} name={this.state.columns[5]} tasks={cols[5]} selectTask={this.selectTask} />
              </div>
            )
          }
        }}
      </Query>
    )
  }

  
}

export default compose(
  graphql(getPrivateChat, { name: 'getChat' }),
  graphql(setPrivateChat, { name: 'setChat' }),
)(Board);