import React, { Component } from 'react'
import {quf, AUTH_TOKEN} from '../constants';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      login: false,
      loginerror: "",
    };

    this.onKeyDown = this.onKeyDown.bind(this)
    this._confirm = this._confirm.bind(this)
  }

  onKeyDown(e){
    if(e.keyCode===13)
    {
      this._confirm()
    }
  }

  _confirm = async () => {
    const { email, password, login } = this.state;
    const { lookft } = this.props

    this.setState({loginerror: ''})

    if(!email || !password) return( this.setState({loginerror: `ошибка! Не введен логин или пароль`}) )

    if (!login) {
      let q = LoginQuery(email, password);

      let result = await quf(q)
        .then(a=>{return a;})
        .catch((e)=>{
          console.warn('Login Error: ',e)
        });


      if(result && result.errors){
        this.setState({loginerror: `ошибка! ${result.errors[0].message}`})
      }

      else if(result && result.data && result.data.login){
        const { jwt, username, id } = result.data.login;

        if(!jwt || !username) return( this.setState({loginerror: `ошибка! сервер не дал ответ`}) )
        this._saveUserData(jwt, username, id)
      }else{
        this.setState({loginerror: `ошибка! Свистать все на верх!`})

        return false;
      }

    } else {
      this.setState({loginerror: `ошибка! Такого пользователя нет`})
    }
    lookft();
  }

  _saveUserData = (token, name, id) => {
    localStorage.setItem('userid', id);
    localStorage.setItem('username', name);
    localStorage.setItem(AUTH_TOKEN, token)
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { loginerror } = this.state;
    const { history } = this.props

    return (

      <div>
        {!authToken ? (
          <div className="auth">
            <div className="logo">
            </div>
            <input type="text" placeholder="Email" onChange={(e) => { this.setState({ loginerror: "", email: e.target.value }) }} />
            <input type="password" placeholder="Пароль" onKeyDown={this.onKeyDown} onChange={(e) => { this.setState({ loginerror: "", password: e.target.value }) }} />
            <div className="button" role="presentation" onClick={() => { this._confirm() }}>Войти</div>
            {
              loginerror ? (<div className="errorMessage">{loginerror}</div>) : ('')
            }
          </div>) :
          (
            <div className="auth">
              <div className="logo">
                <img src="" alt="222" />
              </div>
              <div
                className="button"
                role="presentation"
                onClick={() => {
                  localStorage.removeItem(AUTH_TOKEN)
                  localStorage.removeItem('username')
                  history.push(`/`)
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

const LoginQuery = (email, password) => `
mutation{
  login(user:{email:"${email}",password:"${password}"}){
    id
    username
    jwt
  }
}
`;

export default Login;
