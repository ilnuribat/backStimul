import React, { Component } from "react";
import { graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import { colorHash } from '../../../constants';
import { selectUser, appendUser, getChat } from "../../../GraphQL/Cache";

selectUser
class AddNew extends Component {
  constructor(props){
    super(props)

    this.state = {
      input: [],
    }
    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      if (this.textInput) this.textInput.focus();
    };

    this.changeInput = this.changeInput.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount() {
    this.focusTextInput();
  }

  componentWillReceiveProps() {
    // this.focusTextInput();
  }

  componentDidUpdate(){
    // this.focusTextInput();
  }

  onKeyDown(e){
    if(e.keyCode===13 && e.ctrlKey)
    {
      this.submitHandler(e)
    }
  }

  submitHandler = e => {
    e.preventDefault()

    let { input } = this.state;
    const { add, appendUser, getchat } = this.props;
    let inp = input[0];

    inp = inp.replace(/\s\s/g,'');
    inp = inp.replace(/(?:\r\n\r\n|\n\n|\r\r|\r\n|\r|\n)/g, '\n');
    inp = inp.trim();

    this.setState({
      input: [''],
    })
    let gid =  getchat.id || localStorage.getItem('gid') || 1;

    let message = appendUser.userName?'@'+appendUser.userName + ' ' + inp:inp;

    if(!message){
      return false;
    }else{
      add({
        id: gid,
        text: message,
      });
      this.userSelect();
    }

  }

  changeInput(e){
    let val = e.target.value;
    let inp = [];
    let { input } = this.state;

    inp = input;
    inp[0] = val;

    if(!inp){
      return false;
    }else{
      this.setState({
        input: inp
      })
    }
  }

  userSelect(){
    const { selectUser } = this.props

    selectUser({
      variables: { userName: '', userId: '' }
    })
  }

  render() {
    let user = '';
    let { input } = this.state;
    let { appendUser } = this.props;

    if(!user){
      user = appendUser.userName ? '@'+appendUser.userName + ', ':'';
    }

    return (
      <form className='ChatForm chat-inp' id="addNew" onSubmit={this.submitHandler}>
        <div className="textarea-wrapper">
          {/* <span className="chat-to" style={{color: colorHash.hex(user)}}>{user}</span> */}
          <textarea id="focus-chpocus" onKeyDown={this.onKeyDown} ref={this.setTextInputRef} name="1" type="text" value={input} placeholder='Сообщение...' onChange={this.changeInput} required />
          <div className="Smiles">😉</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1000 1000">
            <g><path d="M388.6,196.2v568.4c0,0-8.3,119.3,113.2,119.3c109.5,0,109.5-119.3,109.5-119.3V166.8c0,0,0-156.8-155.9-156.8c-155.9,0-155.9,156.8-155.9,156.8v597.8c0,0,0,225.4,200.5,225.4c200.5,0,200.5-225.4,200.5-225.4V166.8c0-24.5-44.5-24.5-44.5,0v597.8c0,0,16.2,180.9-155.9,180.9c-155.9,0-155.9-180.9-155.9-180.9V166.8c0,0,0-112.3,111.4-112.3c111.4,0,111.4,112.3,111.4,112.3v597.8c0,0,0,70.3-65,70.3c-65,0-68.6-70.3-68.6-70.3V196.2C433.2,171.7,388.6,171.7,388.6,196.2z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
          </svg>
        </div>
        <button className="ChatSend" type="submit" form="addNew">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z"/>
            <path fill="none" d="M0 0h24v24H0z"/>
          </svg>
        </button>
      </form>
    );
  }
}



AddNew.propTypes = {
  add: PropTypes.func.isRequired,
  selectUser: PropTypes.func.isRequired,
  appendUser: PropTypes.shape({
    userName: PropTypes.string
  }).isRequired,
  getchat: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
};

export default compose(
  graphql(selectUser, { name: 'selectUser' }),
  graphql(appendUser, { name: 'appendUser' }),
  graphql(getChat, { name: 'getchat' }),
)(AddNew);
