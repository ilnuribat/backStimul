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
    let { input } = this.state;

    this.props.append({
     node:{
      id: 1,
      text: input[0]
     }
    });

    if(!input[0]){
      return false;
    }
    this.props.add({
      id: 1,
      text: input[0],
    });
    this.setState({
      input: [],
    })
  }

  render() {
    let { input } = this.state;
    
    return (
      <div>
        <input name="1" type="text" value={input[0]} onChange={this.changeInput} />
        <div className="btn" onClick={this.addMessage}>Add message</div>
      </div>
    );
  }
}

