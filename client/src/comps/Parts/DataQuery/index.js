import React from 'react';
import { Query  } from "react-apollo";

const DataQuery = ({...props})=>{
  return(
    <Query query={props.query} variables={props.vars}>
      {({ loading, error, data }) => {
      // if (loading) return "Loading...";
      // if (error) return `Error! ${error.message}`;

        return data.user.groups;

      }}
    </Query>
  )
};

export default DataQuery;