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
          <span className="chat-to" style={{color: colorHash.hex(user)}}>{user}</span>
          <textarea id="focus-chpocus" onKeyDown={this.onKeyDown} ref={this.setTextInputRef} name="1" type="text" value={input} placeholder='Сообщение...' onChange={this.changeInput} required />
        </div>
        <div><button className="noBtn" type="submit" form="addNew">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z"/>
            <path fill="none" d="M0 0h24v24H0z"/>
          </svg>
        </button></div>
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
