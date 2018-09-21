import React, { Component, Fragment } from 'react'
import { AUTH_TOKEN } from '../constants'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag';
import {quf} from '../constants';

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

    if(!name || !password){

      return( this.setState({loginerror: `ошибка! Не введен логин или пароль`}) )
    }
    console.log(this.state)
    console.log(this.props)
    if (!this.state.login) {

      console.log('Not login');

      let q = LoginQuery(email, password);
      console.log(q);
      
      let result = quf(q).then((d)=>d).catch(e=>console.log(e));

      // const result = await this.props.loginMutation({
      //   variables: {
      //     email,
      //     password,
      //   },
      // });

      console.log('result',result);
      
      const { token, user } = /*result.data.login*/ `{token: 'token', user: {name:'${email}'} }`
      this._saveUserData(token, user.name)

    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      })
      const { token } = result.data.signup
      this._saveUserData(token)
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
            <input type="text" placeholder="Email" onChange={(e) => { this.setState({ email: e.target.value }) }} />
            <input type="password" placeholder="Пароль" onChange={(e) => { this.setState({ password: e.target.value }) }} />
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
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token,
      user {name}
    }
  }
`

const LoginQuery = (email, password) => `
  mutation{ login(email: "${email}", password: "${password}") {
      token,
      user {name}
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),

)(Login)
