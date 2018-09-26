import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { ADD_MUT } from './querys';
import AddNew from './AddNew';

const AddMesMut = ({ children }) => (
  <Mutation
    mutation={ADD_MUT}
  >
    {(addMes, { data, loading, error }) =>
      children(addMes, { data, loading, error })
    }
  </Mutation>
);

export default class ChatBody extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: 0,
    }
    this._update = this._update.bind(this)
  }

    componentDidMount() {
    this.props.subscribeToMoreMes();
  }
  _update(){
    this.setState({messages: this.state.messages + 1})
    this.props.refc()
  }

  render() {
    return (
      <div className="left-bar-inner test">
        <AddMesMut>
          {(add, { data, loading, error }) => (
              <AddNew 
              update={this._update}
              add={({ id, text }) => add({ variables: { id, text } })}
            />
              
          )}
        </AddMesMut>
        <div className="scroller">
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