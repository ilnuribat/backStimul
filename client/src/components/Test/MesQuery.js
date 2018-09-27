import React from "react";
import { Query } from "react-apollo";
import { PropTypes } from 'prop-types';
import { update } from 'immutability-helper';
import { map } from 'lodash';
import { Buffer } from 'buffer';
import { GR_QUERY, MESSAGE_CREATED } from './querys';
import Loading from '../Loading';
import { qauf, _url } from '../../constants';


export default class MesQuery extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      gid: 0,
      uid: 0,
      jwt: '',
      mess: [],
    }
  }

  componentDidMount() {
    let gid = localStorage.getItem('gid');
    let uid = localStorage.getItem('userid');
    let jwt = localStorage.getItem('auth-token');

    this.setState({
      gid: gid,
      uid: uid,
      jwt: jwt,
    })
    this.changeState = this.changeState.bind(this)
    this.messUpdate = this.messUpdate.bind(this)
  }


  changeState(a){
    this.setState({
      gid: a
    })
  }

  messUpdate(a){
    this.setState({
      mess: a,
    })
  }

  render() {
    let { gid, uid, jwt, mess } = this.state;
    if(!gid || gid == 0){
      let q = (id) => `
        query{
          user(id: ${id}){
            groups{
              id
            }
          }
        }
      `;

      qauf(q(uid), _url, jwt).then(a=>{
        if(a && a.data.user.groups){
          this.changeState(a.data.user.groups[0].id);
          localStorage.setItem('gid', a.data.user.groups[0].id);
        }
      }).catch((e)=>{
        console.warn(e);
      });

      return(
        <div style={{ paddingTop: 20 }}>
          <Loading />
        </div>
      )
    
    }else{
      return(
        <Query query={GR_QUERY} variables={{id: gid }}>
          {({ loading, error, data, refetch, subscribeToMore }) => {
            if (loading)
              return (
                <div style={{ paddingTop: 20 }}>
                  <Loading />
                </div>
              );
            let ErrComp;

            if (error){
              return <p> {'Ошибочка вышла :( ' + error.toString()} </p>
            };

            const subscribeToMoreMes = ()=>{
              return subscribeToMore({
                document: MESSAGE_CREATED,
                variables: {
                  id: gid,
                },
                updateQuery: (previousResult, { subscriptionData }) => {
                  
                  refetch();

                  const newMessage = subscriptionData.data.messageAdded;
                  let result = [...previousResult.group.messages.edges, {
                    __typename: 'MessageEdge',
                    node: newMessage,
                    cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                  }];
                  // this.messUpdate(result)
                  //return result;


                  // return update(previousResult, {
                  //   group: {
                  //     messages: {
                  //       edges: {
                  //         $set: [{
                  //           __typename: 'MessageEdge',
                  //           node: newMessage,
                  //           cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                  //         }],
                  //       },
                  //     },
                  //   },
                  // });
                
                },
              });
            };
            
            if(!mess || mess.length != data.group.messages.edges.length){
              this.messUpdate(data.group.messages.edges)
              // refetch()
            }else{
                // return this.props.children(data, subscribeToMoreMes);
                return this.props.children(mess, subscribeToMoreMes);
              
            }
            return true;
          }}
        </Query>
      )
    }
  }
}
