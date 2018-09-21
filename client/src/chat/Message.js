import React from 'react'

class Message extends React.Component {
  render() {
    let user = localStorage.getItem('username');
    let fromMe = this.props.fromMe ? 'from-me' : '';
    
    if(user === this.props.username){
      fromMe = 'from-me';
    }

    return (
      <div className={`message ${fromMe}`}>
        <div className='username'>Пользователь {this.props.username}</div>
        <div className='message-body'>{this.props.message}</div>
        <div className='message-date'>{this.props.date}</div>
      </div>
    )
  }
}

Message.defaultProps = {
  username: '',
  message: '',
  date: '',
  fromMe: false
}

export default Message
