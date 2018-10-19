import React, { Component, Fragment } from 'react';
import { graphql, compose, Query, Subscription } from "react-apollo";
import readline from 'readline';
// import Autocomplete from 'react-autocomplete';
import Private from './Nav/Private';
import Groups from './Nav/Groups';
import Profile from './Nav/Profile';
import Board from './Nav/Board';
import PropTypes from 'prop-types';
import Loading from './Loading';

import { PRIVS_QUERY, cSetCountPrivates, ALL_MESSAGE_CREATED, taskUpdated, TASKS_QUERY, setRefGroups, getRefGroups } from '../graph/querys';


let refUser;


// function completer(line) {
//   var currAddedDir = (line.indexOf('/') != - 1) ? line.substring(0, line.lastIndexOf('/') + 1) : '';
//   var currAddingDir = line.substr(line.lastIndexOf('/') + 1);
//   var path = __dirname + '/' + currAddedDir;
//   var completions = fs.readdirSync(path);
//   var hits = completions.filter(function(c) { return c.indexOf(currAddingDir) === 0});

//   var strike = [];
//   if (hits.length === 1) strike.push(currAddedPath + hits[0] + '/');

//   return (strike.length) ? [strike, line] : [hits.length ? hits : completions, line];
// }

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   completer: completer
// });

// rl.question('whatever', function(answer) {
//   // Do what ever
// });




class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
    }
  }

  hidePanel = () => {
  }

  shouldComponentUpdate(nextProps,nextState){

    if(nextProps.getRefGroups.ref){
      return true;
    }else{
      return false;
    }
  }

  componentDidUpdate(){

    console.log("Update Nav")

    let {getRefGroups, setRefGroups} = this.props;

    if(!!getRefGroups.ref && !!refUser){

      refUser().then(()=>{
        setRefGroups({
          ref: false,
        })
      })


      
    }
  }

  render() {
    // const { getUnreadCount } = this.props;

    // console.warn ("user: " , getUnreadCount.user)

    return (
      <Fragment>
        <nav className="left-nav">
          <Profile />
          <Groups />
          <Board />
          <Query query={PRIVS_QUERY}>
            {({ loading, error, data, refetch, subscribeToMore }) => {
              if (loading){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }
              if (error){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }
              if(data && data.user && data.user.directs){
                let privs = 0;

                data.user.directs.map((e,i)=>{
                  privs = privs + e.unreadCount;
                })


                this.props.cSetCountPrivates({
                  variables: { unr: privs }
                });
              }

              // subscrMes(subscribeToMore, refetch)
              subscrMes()

              return <Private />
            }}
          </Query>



          <Query query={TASKS_QUERY} >
            {({ loading, error, data, refetch, subscribeToMore }) => {
              if (loading){
                return (
                  <div style={{ paddingTop: 20, margin: "auto"}}>
                    <Loading />
                  </div>
                );
              }
              if (error){
                return (
                  <div style={{ paddingTop: 20 }}>
                    <Loading />
                  </div>
                );
              }

              if(data){

                console.log("tasks",data);

                data.user.groups.map((e,i)=>{
                  let id = e.id;
            // return(
            //         <Subscription
            //           subscription = {taskUpdated} variables={{id: id}}>
            //           {({ data, error }) => {
            //             if(error){
            //               console.log(error)
            //             }
            //             console.warn("tasks____", data);
            //             return data;
            //           }}
            //         </Subscription>
            //       )

                  let subs = () =>{
                    subscribeToMore({
                      document: taskUpdated,
                      variables: { id: id },
                      updateQuery: (prev, { subscriptionData }) => {
                        refUser = refetch;
                        if (!subscriptionData.data) return prev;
                        const newFeedItem = subscriptionData.data.commentAdded;
          
                          console.log(prev);
                          console.log(subscriptionData);
                          refetch();

                        return true;

                        return Object.assign({}, prev, {
                          user: {
                            groups: [newFeedItem, ...prev.entry.comments]
                          }
                        });
                      }
                    });
                  };

                  subs();


                  // subscribeToMore();
                  // return(
                  //   <Subscription
                  //     subscription = {taskUpdated} variables={{id}}>
                  //     {({ data }) => {
                  //       console.warn("tasks____", data);
                  //       return data;
                  //     }}
                  //   </Subscription>
                  // )
                });

                return true;


              }



              // if(data && data.user && data.user.directs){
              //   let privs = 0;

              //   data.user.directs.map((e,i)=>{
              //     privs = privs + e.unreadCount;
              //   })


              //   this.props.cSetCountPrivates({
              //     variables: { unr: privs }
              //   });
              // }



              return true;
            }}
          </Query>

        </nav>
      </Fragment>
    )
  }
}

// const subscrMes = (subscribeToMore, refetch)=>{
//   return subscribeToMore({ document: ALL_MESSAGE_CREATED,
//     updateQuery: (prev, { subscriptionData }) => {
//       if (!subscriptionData.data) return prev;

//       console.warn("previ is", prev)
//       console.warn("new is", subscriptionData.data)

//       return Object.assign({}, prev, {
//         message:{
//           isRead: true,
//           text: prev.message.text,
//           __typename: prev.message.__typename,
//         }
//       });

//     },
//   });
// };

const subscrMes = ()=> {
  <Subscription
    subscription = {ALL_MESSAGE_CREATED}>
    {({ data }) => {
      console.warn("asasas", data)
    }}
  </Subscription>
}

const subscrTasks = (id)=> {
  <Subscription
    subscription = {taskUpdated} variables={id}>
    {({ data }) => {
      console.warn("tasks", data)
    }}
  </Subscription>
}


LeftNav.propTypes = {
  getUnreadCount: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      directs: PropTypes.array,
      groups: PropTypes.array,
    }),
  }),
  cSetCountPrivates: PropTypes.func
};


export default compose(
  graphql(cSetCountPrivates, { name: 'cSetCountPrivates' }),
  graphql(getRefGroups, { name: 'getRefGroups' }),
  graphql(setRefGroups, { name: 'setRefGroups' }),
)(LeftNav);

