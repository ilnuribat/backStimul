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
    this.submitHandler = this.submitHandler.bind(this)
  }

  changeInput(e){
    let val = e.target.value;
    let input = [];
    
    input.push(val);
    
    this.setState({
      input: input
    })
  }
  submitHandler = e => {
    e.preventDefault()
    let { input } = this.state;
    this.setState({
      input: [''],
    })
    let gid = localStorage.getItem('gid') || 1;
    
    if(!input[0]){
      return false;
    }
    this.props.add({
      id: gid,
      text: input[0],
    });
    this.props.append({
      node:{
        id: gid,
        text: input[0],
      }
    });


  }
  addMessage(e){
    // e.preventDefault();
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    let { input } = this.state;

    // if(!input[0]){
    //   return false;
    // }
    // this.props.add({
    //   id: 1,
    //   text: input[0],
    // });
    // this.props.append({
    //   node:{
    //    id: 1,
    //    text: input[0]
    //   }
    //  });
    // this.setState({
    //   input: [],
    // })
  }

  render() {
    let { input } = this.state;

    return (
      <div style={{textAlign: "center"}}>
        <form className='chat-input' onSubmit={this.submitHandler}>
          <input name="1" type="text" value={input[0]} placeholder='Сообщение...' onChange={this.changeInput} required />
          <input type="submit" className="button" onClick={this.submitHandler} value="Отправить" />
        </form>
      </div>
    );
  }
}

