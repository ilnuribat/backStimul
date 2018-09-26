import React, { Component } from "react";
import { graphql, compose } from 'react-apollo';

export default class AddNew extends Component {
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
    // this.props.appendMessage({
    //  node:{
    //   id: 1,
    //   text: this.state.input[0]
    //  }
    // });

    if(!this.state.input[0]){
      return false;
    }
    this.props.add({
      id: 1,
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

