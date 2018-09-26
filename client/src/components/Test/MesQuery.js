import React from "react";
import { Query } from "react-apollo";
import { GR_QUERY, MESSAGE_CREATED } from './querys';
import Loading from '../Loading';
import { PropTypes } from 'prop-types';
import { update } from 'immutability-helper';
import { map } from 'lodash';
import { Buffer } from 'buffer';
import { qauf, url } from '../../constants';


export default class MesQuery extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      gid: 0,
      uid: 0,
      jwt: '',
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

  }


  changeState(a){
    this.setState({
      gid: a
    })
  }

  render() {
    console.log(this.state);
    

    if(!this.state.gid || this.state.gid == 0){
      let q = (id) => `
        query{
          user(id: ${id}){
            groups{
              id
            }
          }
        }
      `;

      qauf(q(this.state.uid), url, this.state.jwt).then(a=>{
          console.log(a);
        if(a && a.data.user.groups){
          console.log("a",a.data.user.groups[0].id);
          this.changeState(a.data.user.groups[0].id)

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
        <Query query={GR_QUERY} variables={{id: 1 }}>
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
                id: 1,
              },
              updateQuery: (previousResult, { subscriptionData }) => {
                
                refetch();

                const newMessage = subscriptionData.data.messageAdded;
    
                return update(previousResult, {
                  group: {
                    messages: {
                      edges: {
                        $set: [{
                          __typename: 'MessageEdge',
                          node: newMessage,
                          cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                        }],
                      },
                    },
                  },
                });
              },
            });
          };
              
          if(data.group){
            return this.props.children(data, subscribeToMoreMes);
          }
    
          return true;
        }}
      </Query>
      )
    }


  }
}
