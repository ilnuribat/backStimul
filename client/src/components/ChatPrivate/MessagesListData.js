import React, { Component } from "react";
import { Query} from "react-apollo";
import { MESSAGE_CREATED } from '../../graph/querys';
import MessagesList from './MessagesList';

export default class MessagesListData extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <Query
        query={this.props.query}
        variables={{ id: `${this.props.id}` }}
      >
        {({ subscribeToMore, refetch, ...result }) =>{

          const subs = (id) =>{
            return subscribeToMore({
              document: MESSAGE_CREATED,
              variables: { id: id },

              updateQuery: (prev, { subscriptionData }) => {

                if (!subscriptionData.data) return prev;
                // subscriptionData.data.messageAdded.isRead = false;
                const newFeedItem = {cursor: subscriptionData.data.messageAdded.id, node: subscriptionData.data.messageAdded,
                  __typename: "MessageEdge" };

                if(this.props.priv){
                  const aaa  = Object.assign({}, prev, {
                    direct: {
                      messages:{
                        edges: [...prev.direct.messages.edges, newFeedItem],
                        __typename: "MessageConnection",
                      },
                      unreadCount: 0,
                      __typename: "Direct"
                    }
                  });

                  return aaa
                }else{
                  return Object.assign({}, prev, {
                    group: {
                      messages:{
                        edges: [...prev.group.messages.edges, newFeedItem],
                        __typename: "MessageConnection"
                      },
                      __typename: "Group"
                    }
                  });
                }

              },
              onError: (err)=>{
                console.warn('ERR-----',err)
              },
            })
          };

          return(
            <MessagesList
              key={this.props.id}
              priv={this.props.priv}
              {...result}

              subscribeToNewMessages={() =>subs(this.props.id)

              }
            />
          )}
        }
      </Query>
    )}
}


