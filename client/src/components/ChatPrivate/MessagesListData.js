import React from "react";
import PropTypes from 'prop-types';
import { Query} from "react-apollo";
// import { MESSAGE_CREATED } from '../../graph/querys';
import MessagesList from './MessagesList';

const MessagesListData = ({ query, id, priv }) => (

  <Query
    query={query}
    variables={{ id: `${id}` }}
  >
    {({ data }) =>{
      // {({ loading, error, refetch, data }) =>{

      // console.warn(data)
      // refetch()

      // const subs = (id) =>{
      //   return subscribeToMore({
      //     document: MESSAGE_CREATED,
      //     variables: { id: id },

      //     updateQuery: (prev, { subscriptionData }) => {

      //       if (!subscriptionData.data) return prev;
      //       // subscriptionData.data.messageAdded.isRead = false;
      //       const newFeedItem = {cursor: subscriptionData.data.messageAdded.id, node: subscriptionData.data.messageAdded,
      //         __typename: "MessageEdge" };

      //       if(this.props.priv){
      //         const aaa  = Object.assign({}, prev, {
      //           direct: {
      //             messages:{
      //               edges: [...prev.direct.messages.edges, newFeedItem],
      //               __typename: "MessageConnection",
      //             },
      //             unreadCount: 0,
      //             __typename: "Direct"
      //           }
      //         });

      //         return aaa
      //       }else{
      //         return Object.assign({}, prev, {
      //           group: {
      //             messages:{
      //               edges: [...prev.task.messages.edges, newFeedItem],
      //               __typename: "MessageConnection"
      //             },
      //             __typename: "Group"
      //           }
      //         });
      //       }

      //     },
      //     onError: (err)=>{
      //       console.warn('ERR-----',err)
      //     },
      //   })
      // };

      return(
        <MessagesList
          key={id}
          priv={priv}
          data = {data}

          // subscribeToNewMessages={() =>subs(this.props.id)}
        />
      )}
    }
  </Query>
)

MessagesListData.propTypes = {
  id:PropTypes.string.isRequired,
  priv: PropTypes.number.isRequired,
  query:PropTypes.object.isRequired,

};

export default MessagesListData
