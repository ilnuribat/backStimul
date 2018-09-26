import React from "react";
import { Query } from "react-apollo";
import { GR_QUERY, MESSAGE_CREATED } from './querys';
import Loading from '../Loading';
import { PropTypes } from 'prop-types';

const MesQuery = ({ children }) => (
  <Query query={GR_QUERY} variables={{id: 4 }}>
    {({ loading, error, data, refetch, subscribeToMore }) => {
      if (loading)
        return (
          <div style={{ paddingTop: 20 }}>
            <Loading />
          </div>
        );
      if (error) return <p>Error :(</p>;
      const subscribeToMoreMes = () => {
        subscribeToMore({
          document: MESSAGE_CREATED,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data || !subscriptionData.data.messageAdded)
              return prev;
            const newMesAdded = {"node": subscriptionData.data.messageAdded };
            let arr = [];

            arr = Array.from(prev.group.messages.edges);
            arr.push(newMesAdded);
            const a = prev;
            let Clone = JSON.parse(JSON.stringify(prev));

            Clone.group.messages.edges = arr;

            const b = Object.assign({}, Clone, { "Symbol(id)": "ROOT_QUERY"});

            console.log(subscriptionData)
            console.log(prev)
            console.log(newMesAdded)
            console.log("a object",a)
            console.log("Clone object",Clone)
            console.log("b object",b)

            return a;
          }
        });
      };
      const refc = () =>{
        refetch();
      }
        
      if(data.group){
        return children(data.group.messages.edges, subscribeToMoreMes, refc);
      }

      return true;
    }}
  </Query>
);


export default MesQuery;