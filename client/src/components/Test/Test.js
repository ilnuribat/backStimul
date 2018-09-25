import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import React, { Component, Fragment } from "react";
import Loading from '../Loading.js';


const PinsQuery = ({ children }) => (
    // <Query query={GR_QUERY} variables={{id: localStorage.getItem("userid")}}>
    <Query query={GR_QUERY} variables={{id: 4 }}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading)
          return (
            <div style={{ paddingTop: 20 }}>
              <Loading />
            </div>
          );
        if (error) return <p>Error :(</p>;
        const subscribeToMorePins = () => {
          subscribeToMore({
            document: MESSAGE_CREATED,
            updateQuery: (prev, { subscriptionData }) => {
                // console.log("prev")
                // console.log(prev)
                // console.log("subscriptionData")
                // console.log(subscriptionData)
              if (!subscriptionData.data || !subscriptionData.data.messageAdded)
                return prev;
              const newPinAdded = {"node": subscriptionData.data.messageAdded };

                
              let arr = [];
              arr = Array.from(prev.group.messages.edges);
              arr.push(newPinAdded);

            //   const a = Object.assign({}, prev);
              const a = prev;
              
            //   const b = a.group.messages.edges = Object.assign({}, prev);

                let Clone = JSON.parse(JSON.stringify(prev));
                Clone.group.messages.edges = arr;

                const b = Object.assign({}, prev, Clone);

              console.log(subscriptionData)
              console.log(prev)
              console.log(newPinAdded)
              console.log("a object",Clone)
              console.log("b object",b)
            //   
              return b;
            }
          });
        };
        
        //console.log(data)
        if(data.group){
            return children(data.group.messages.edges, subscribeToMorePins);
        }
        return true;
      }}
    </Query>
  );
  
  const AddPinMutation = ({ children }) => (
    <Mutation
      mutation={gql
        `mutation Add($id: Int!, $text: String! ){
            createMessage(message:{groupId: $id, text: $text}){
              id
              text
              from{
                  id
              }
              to{
                  id
              }
            }
          }`
      }
    >
      {(addPin, { data, loading, error }) =>
        children(addPin, { data, loading, error })
      }
    </Mutation>
  );
  
  class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            messages: 0,
        }

        this._update = this._update.bind(this)
    }

    _update(){
        console.log("add return")
        this.setState({messages: this.state.messages + 1})
        console.log("messages",this.state.messages)
    }

    componentDidMount() {
      this.props.subscribeToMorePins();
    }

    render() {
      return (
        <div className="left-bar-inner test">
        <AddPinMutation >
            {(add, { data, loading, error }) => (
              <Add 
                update={this._update}
                add={({ id, text }) => add({ variables: { id, text } }) }
              />
              
            )}
          </AddPinMutation>
        <div className="scroller">
            {console.log("messages",this.props)}
            {
              this.props.messages.map((el,i,arr)=>{
                  return(
                      <div className="chmessage" key={i}>{el.node.text}</div>
                  )
              })
            }

          </div>
        </div>
      );
    }
  }

  class Add extends Component {
    constructor(props){
        super(props)

        this.state = {
            input: [],
        }


    this.changeInput = this.changeInput.bind(this)
    this.addMessage = this.addMessage.bind(this)
    }

    changeInput(e){
        let val = e.target.value;
        let input = [];
    
        input.push(val);
    
          this.setState({
            input: input
          })
      }
    
      addMessage(){
        this.props.add({
            id: 4,
            text: this.state.input[0],
          });
          this.props.update();
        return true;
      }

    render() {
      return (
          <div>
            <input name="1" type="text" value={this.state.input[0]} onChange={this.changeInput} />
            <div className="btn" onClick={this.addMessage}>Add message</div>
          </div>
      );
    }
  }




  export default () => (
      <PinsQuery>
        {/* Wrap App with PinsQuery because we need to access subscribeToMorePins in componentDidMount */}
        {(messages, subscribeToMorePins) => (
          <App messages={messages} subscribeToMorePins={subscribeToMorePins} />
        )}
      </PinsQuery>
  );
  

  const GR_QUERY = gql`
    query group($id: Int!, $messageConnection: ConnectionInput = {first: 0}){
        group(id: $id ){
            id
            name
            users{
                id
                username
            }
            messages(messageConnection: $messageConnection) {
                edges {
                    cursor
                    node {
                        id
                        to {
                        id
                        }
                        from {
                        id
                        username
                        }
                        createdAt
                        text
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
            }
        }
    }
`;

  const USER_QUERY = gql`
    query user($id: Int!){
        user(id: $id ){
            email
            messages{
                id
                text
                from{
                    id
                }
                to{
                    id
                }
            }
        }
    }
`;
const MESSAGE_CREATED = gql`
    subscription{
        messageAdded(groupIds: 4){
            id
            text
            from{
                    id
                }
                to{
                    id
                }
        }
    }
`;
