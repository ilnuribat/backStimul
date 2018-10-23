import React, { Component } from 'react';
import { graphql, compose, Query  } from "react-apollo";
import _ from 'lodash';
import 'animate.css';
import { TASKS_QUERY, getPrivateChat, setPrivateChat, glossaryStatus, getCUser, setTemp, getTemp } from '../graph/querys';
import { qauf, _url } from '../constants';
import Column from './BoardParts/Column';
import DataQuery from './BoardParts/DataQuery';
import Loading from './Loading';
// import anime from 'animejs';


let r;

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: [],
      status: [],
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

  render(){

    if(r){
      r();
    }

    let { status } = this.state;
    let { getCUser, getTemp } = this.props;
    let cols = [[],[],[],[],[],[],[]];
   
    if(getCUser.loading) return <Loading />;
    if(!getCUser.user) return <Loading />;
    if(!getCUser.user.groups) return <Loading />;

    let arr = getCUser.user.groups;

    arr = _.sortBy(arr, 'unreadCount');
  
    _.forEach(arr, (result)=>{
      if(!result.status){
        cols[1].push(result);
      }
      if(result.status){
        cols[result.status].push(result);
      }
    });

    

    return(
      <div id="anim" className="content-aft-nav columns-wrapper">

        {
          status.map((e,i)=>{
            if(!e.name){
              return true;
            }
            return <Column key={"column"+e.id} name={e.name} tasks={cols[i]} selectTask={this.selectTask} />
          })
        }
      </div>
    )

      // <Query query={TASKS_QUERY}>
      //   {({ loading, error, data, refetch }) => {
      //     r = refetch;
      //     if (loading) return "Loading...";
      //     if (error) return `Error! ${error.message}`;
      //     if(data && data.user && data.user.groups){
  
      //       console.log(data.user.groups);
      //       let arr = data.user.groups;
  
      //       arr = _.sortBy(arr, 'unreadCount');
  
      //       // let i = 1;
  
      //       _.forEach(arr, (result)=>{
      //         if(!result.status){
      //           cols[1].push(result);
      //         }
      //         if(result.status){
      //           cols[result.status].push(result);
      //         }
      //       });

      //       return(
      //         <div className="content-aft-nav columns-wrapper">
      //           {
      //             status.map((e,i)=>{
      //               if(!e.name){
      //                 return true;
      //               }
      //               return <Column key={"column"+e.id} name={e.name} tasks={cols[i]} selectTask={this.selectTask} />
      //             })
      //           }
      //         </div>
      //       )
      //     }
      //   }}
      // </Query>
    
  }

  
}

export default compose(
  graphql(getPrivateChat, { name: 'getChat' }),
  graphql(setPrivateChat, { name: 'setChat' }),
  graphql(getCUser, { name: 'getCUser' }),
  graphql(setTemp, { name: 'setTemp' }),
  graphql(getTemp, { name: 'getTemp' }),
)(Board);