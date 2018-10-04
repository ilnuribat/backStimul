import React from "react";
import { Query, graphql, compose  } from "react-apollo";
import { PropTypes } from 'prop-types';
// import { update } from 'immutability-helper';
// import { Buffer } from 'buffer';
// import {  } from './querys';
import Loading from '../Loading';
import { qauf, _url } from '../../constants';
// import gql from 'graphql-tag';
import { showCurrentGroup, getPrivateChat, GR_QUERY, PRIV_QUERY, MESSAGE_CREATED } from '../../graph/querys';

class MesQuery extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: '',
      name: '',
      mess: [],
    }
    this.changeState = this.changeState.bind(this)
    this.messUpdate = this.messUpdate.bind(this)
  }

  componentDidMount() {
    const {id, name } = this.props;

    this.setState({
      id: id,
      name: name,
    })

  }


  changeState(a){
    this.setState({
      id: a,
    })
  }

  messUpdate(a){
    this.setState({
      mess: a,
    })
  }



  render() {

    const { id, name, mess } = this.state;
    const { getchat, children, priv } = this.props;

    let _id = getchat.id || id;
    let _name = getchat.name || name;
    let _query = GR_QUERY;

    priv ? _query = PRIV_QUERY : null;

    if(!_id || _id === ''){

      return(
        <div style={{ paddingTop: 20 }}>
          <Loading />
        </div>
      )

    } else{
      return(
        <Query query={_query} variables={{id: _id }}>
          {({ loading, error, data, refetch, subscribeToMore }) => {
            if (loading)
              return (
                <div style={{ paddingTop: 20 }}>
                  <Loading />
                </div>
              );
            // let ErrComp;

            if (error){
              return <p className="errorMessage"> {'Ошибочка вышла :( ' + error.toString()} </p>
            }

            const subscribeToMoreMes = ()=>{
              return subscribeToMore({ document: MESSAGE_CREATED, variables: {id: _id,},
                // updateQuery: (previousResult, { subscriptionData }) => {
                updateQuery: () => {

                  refetch();

                  // const newMessage = subscriptionData.data.messageAdded;
                  // let result = [...previousResult.group.messages.edges, {
                  //   __typename: 'MessageEdge',
                  //   node: newMessage,
                  //   cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
                  // }];

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

            if(priv){
              if(!mess || mess.length !== data.direct.messages.edges.length){
                this.messUpdate(data.direct.messages.edges)
              }else{
                return children(mess, subscribeToMoreMes, _id, _name);
              }
            }else{
              if(!mess || mess.length !== data.group.messages.edges.length){
                this.messUpdate(data.group.messages.edges)
              }else{
                return children(mess, subscribeToMoreMes, _id, _name);
              }
            }


            return true;
          }}
        </Query>
      )
    }
  }
}

MesQuery.propTypes = {
  showCurrentGroup: PropTypes.shape({
    currentGroup: PropTypes.string
  }).isRequired,
  children: PropTypes.func.isRequired
};

export default compose(
  graphql(showCurrentGroup, { name: 'showCurrentGroup' }),
  graphql(getPrivateChat, { name: 'getchat' }),
)(MesQuery);
