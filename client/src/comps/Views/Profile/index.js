import React, { Component } from 'react';
import Content from '../../Lays/Content/index';
import '../../../newcss/login.css'


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
      name: '',
      logged: false,
    };

  }

  getUserNamePass = () => {
    if (!this.state.email || this.state.email.length < 3) {
      return false;
    } else {
      localStorage.removeItem('username')
      localStorage.removeItem('userid')
      localStorage.setItem('username', this.state.email)
    }
  }

  componentDidMount() {
    let user = localStorage.getItem('username');

    if (!user) {
      this.setState({ logged: false });
    } else {
      this.setState({ email: user });
    }
  }

  render() {
    return (
      <Content>
        <div className="ProfilePage">
          <div className="container mini Profile">
            <h3>Привет, {this.state.user}!</h3>
            <div>Вы можете изменить своё имя</div>
            <input type="text" placeholder="новый Логин или Email" onChange={(e) => {
              this.setState({ email: e.target.value });
            }} />
            <div className="button" onClick={() => { this.getUserNamePass() }}>изменить имя</div>
          </div>
        </div>
      </Content> 
    )
  }
}

export default Profile;
