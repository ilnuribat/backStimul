import React, { Component, Fragment } from 'react'
import { AUTH_TOKEN } from '../constants'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag';
import {quf} from '../constants';
import Message from '../chat/Message';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      login: false,
      loginerror: "", 
    };
  }

  _confirm = async () => {
    const { name, email, password } = this.state;

    if(!email || !password) return( this.setState({loginerror: `ошибка! Не введен логин или пароль`}) )

    if (!this.state.login) {
      let q = LoginQuery(email, password);
      let result = await quf(q)
      .then(a=>{return a;})
      .catch((e)=>{
        console.warn('Login Error: ',e)
      });
      // const result = await this.props.loginMutation({
      //   variables: {
      //     email,
      //     password,
      //   },
      // });

      if(result && result.errors){
        this.setState({loginerror: `ошибка! ${result.errors[0].message}`})
      }
      else if(result && result.data && result.data.login){
        const { jwt, username } = result.data.login;
        if(!jwt || !username) return( this.setState({loginerror: `ошибка! Ответ не пришел`}) )
        this._saveUserData(jwt, username)
      }else{
        this.setState({loginerror: `ошибка! Свистать все на верх!`})
        return false;
      }

    } else {
      // const result = await this.props.signupMutation({
      //   variables: {
      //     name,
      //     email,
      //     password,
      //   },
      // })
      // const { jwt } = result.data.signup
      // this._saveUserData(jwt)
      this.setState({loginerror: `ошибка! Такого пользователя нет`})
    }
    this.props.lookft();
    //window.location.reload();
    // this.props.history.push(`/`)
  }

  _saveUserData = (token, name) => {
    console.log("save user data");

    localStorage.setItem('username', name);
    localStorage.setItem(AUTH_TOKEN, token)
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (

      <div>
        {!authToken ? (
          <div className="auth">
            <div className="logo">
              <img src="" />
            </div>
            <input type="text" placeholder="Email" onChange={(e) => { this.setState({ loginerror: "", email: e.target.value }) }} />
            <input type="password" placeholder="Пароль" onChange={(e) => { this.setState({ loginerror: "", password: e.target.value }) }} />
            <div className="button" onClick={() => { this._confirm() }}>Войти</div>
            {
              this.state.loginerror ? (<div className="errorMessage">{this.state.loginerror}</div>) : ('')
            }
          </div>) : (
            <div className="auth">
              <div className="logo">
                <img src="" />
              </div>
              <div className="button" onClick={() => {
                localStorage.removeItem(AUTH_TOKEN)
                localStorage.removeItem('username')
                this.props.history.push(`/`)
              }}
              >
                Выйти
                  </div>
            </div>
          )}
      </div>
    )
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(user:{email: $email, password: $password}) {
      username
      jwt
    }
  }
`;

const LoginQuery = (email, password) => `
mutation{
  login(user:{email:"${email}",password:"${password}"}){
    username
    jwt
  }
}
`;

// export default compose(
//   // graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
//   // graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
// )(Login)
export default Login;