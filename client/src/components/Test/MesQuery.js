import React from "react";
import { Query } from "react-apollo";
import { GR_QUERY, MESSAGE_CREATED } from './querys';
import Loading from '../Loading';
import { PropTypes } from 'prop-types';
import { update } from 'immutability-helper';
import { map } from 'lodash';
import { Buffer } from 'buffer';

const MesQuery = ({ children }) => (
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
      


      const refc = () =>{
        refetch();
      }
        
      if(data.group){
        return children(data, subscribeToMoreMes, refc);
      }

      return true;
    }}
  </Query>
);


export default MesQuery;