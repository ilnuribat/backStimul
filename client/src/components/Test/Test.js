import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import React, { Component, Fragment } from "react";
import Loading from '../Loading.js';
import { GR_QUERY, MESSAGE_CREATED, ADD_MUT } from './querys'

const PinsQuery = ({ children }) => (
    <Query query={GR_QUERY} variables={{id: 4 }}>
      {({ loading, error, data, refetch, subscribeToMore }) => {
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
              if (!subscriptionData.data || !subscriptionData.data.messageAdded)
                return prev;
              const newPinAdded = {"node": subscriptionData.data.messageAdded };
              let arr = [];
              arr = Array.from(prev.group.messages.edges);
              arr.push(newPinAdded);
              const a = prev;
                let Clone = JSON.parse(JSON.stringify(prev));
                Clone.group.messages.edges = arr;

                const b = Object.assign({}, Clone, { "Symbol(id)": "ROOT_QUERY"});

              console.log(subscriptionData)
              console.log(prev)
              console.log(newPinAdded)
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
            return children(data.group.messages.edges, subscribeToMorePins, refc);
        }
        return true;
      }}
    </Query>
  );
  
  const AddPinMutation = ({ children }) => (
    <Mutation
      mutation={ADD_MUT}
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
        this.setState({messages: this.state.messages + 1})
        this.props.refc()
    }

    componentDidMount() {
      this.props.subscribeToMorePins();
      console.log("mounted")
      console.log(this.props)
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
        {(messages, subscribeToMorePins, refc) => (
          <App messages={messages} refc={refc} subscribeToMorePins={subscribeToMorePins} />
        )}
      </PinsQuery>
  );
  

