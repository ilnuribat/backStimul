import React, { Component } from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Task from './Task';

export default class Column extends Component {
  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this);
    this.state = {
      update: false
    };
  }

  handler() {
    this.setState({
      update: true
    });
  }

  render() {
    return (
      <Query query={GETTASKS_BYCID} variables={{ id: this.props.id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return "Загрузка...";
          if (error) return (<div className="errorMessage">`Error! ${error.message}`</div>);

          if(data.tasks){
            return (
              <div className="column" >
                {this.props.name}
  
                <div className="small">id: {this.props.id}</div>
                {data.tasks.map((task, i, arr) => {
                  return (
                    <Task key={i} name={task.name} description={task.description} id={task.id} />
                  )
                }
                )}
  
              </div>
            );
          }else{
            return(
              <div className="mess">Ничего не найдено</div>
            )
          }

        }}
      </Query>

    )
  }
}
// }
const GETTASKS_BYCID = gql`
query getTasks($id: Int!) {
    tasks(columnId: $id) {
      id
      name
      description
    }
  }
`;