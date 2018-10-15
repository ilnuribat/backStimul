import React, { Component, Fragment } from 'react';
import { graphql, compose, Query, Subscription } from "react-apollo";
import Private from './Nav/Private';
import Groups from './Nav/Groups';
import Profile from './Nav/Profile';
import Board from './Nav/Board';
import PropTypes from 'prop-types';
import Loading from './Loading';

import { PRIVS_QUERY, cSetCountPrivates, ALL_MESSAGE_CREATED } from '../graph/querys';

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
    }
  }

  hidePanel = () => {
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
)(LeftNav);

