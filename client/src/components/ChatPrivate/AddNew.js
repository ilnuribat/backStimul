import React, { Component } from "react";
import { graphql, compose  } from "react-apollo";
import PropTypes from 'prop-types';
import ColorHash from 'color-hash';
import { selectUser, showCurrentGroup, appendUser, getPrivateChat } from '../../graph/querys';


let colorHash = new ColorHash({lightness: 0.7, hue: 0.8});

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
    this.focusTextInput();
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
    const { add, showCurrentGroup, appendUser, getchat } = this.props;
    let inp = input[0];

    inp = inp.replace(/\s\s/g,'');
    inp = inp.trim();

    this.setState({
      input: [''],
    })
    let gid = showCurrentGroup.currentGroup || getchat.id || localStorage.getItem('gid') || 1;
    
    if(!inp){
      return false;
    }else{
      add({
        id: gid,
        text: appendUser.userName?'@'+appendUser.userName + ' ' + inp:inp,
      });
      this.userSelect();
    }

    // this.props.toBottom();

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
      <form className='chat-inp' id="addNew" onSubmit={this.submitHandler}>
        <div className="textarea-wrapper">
          <span className="chat-to" style={{color: colorHash.hex(user)}}>{user}</span>
          <textarea id="focus-chpocus" onKeyDown={this.onKeyDown} ref={this.setTextInputRef} name="1" type="text" value={input} placeholder='Сообщение...' onChange={this.changeInput} required />
        </div>
        <div><button className="circ" type="submit" form="addNew">></button></div>
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
  showCurrentGroup: PropTypes.shape({
    currentGroup: PropTypes.string
  }).isRequired,
  getchat: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
};

export default compose(
  graphql(showCurrentGroup, { name: 'showCurrentGroup' }),
  graphql(selectUser, { name: 'selectUser' }),
  graphql(appendUser, { name: 'appendUser' }),
  graphql(getPrivateChat, { name: 'getchat' }),
)(AddNew);
