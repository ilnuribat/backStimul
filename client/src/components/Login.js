import React, { Component } from 'react';
import { graphql, compose  } from "react-apollo";
import {quf, AUTH_TOKEN} from '../constants';
import { meSet, meGet } from '../graph/querys';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      meid: '',
      memail: '',
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
    const { lookft } = this.props;

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

        if(!jwt || !username) return( this.setState({loginerror: `ошибка! сервер не дал ответ`}) );

        this._saveUserData(jwt, username, id);
        // let { meSet } = this.props;

        this.props.meSet({variables:{
          meid: id,
          mename: username,
          memail: username,
        }
        });
        this.setState({
          meid: id,
          mename: username,
          memail: username,
        });

      }else{
        this.setState({loginerror: `ошибка! Свистать всеХ на верХ!`})

        return false;
      }

    } else {
      this.setState({loginerror: `ошибка! Такого пользователя нет`})
    }
    lookft();
  }

  _saveUserData = (token, name, id) => {

    localStorage.setItem('userid', id);
    localStorage.setItem('usermail', name);
    localStorage.setItem('username', name);
    localStorage.setItem(AUTH_TOKEN, token);
  }

  render() {

    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { loginerror, meid, mename } = this.state;
    // const { history, meGet, meSet } = this.props;
    const { history } = this.props;

    // console.warn("MeName",meGet.mename)

    return (

      <div>
        {!authToken ? (
          <div className="auth">
            <div className="logo">
            </div>
            <div><input type="text" placeholder="Email" onChange={(e) => { this.setState({ loginerror: "", email: e.target.value }) }} /></div>
            <div><input type="password" placeholder="Пароль" onKeyDown={this.onKeyDown} onChange={(e) => { this.setState({ loginerror: "", password: e.target.value }) }} /></div>
            <div><div className="button" role="presentation" onClick={() => { this._confirm() }}>Войти</div></div>
            {
              loginerror ? (<div className="errorMessage">{loginerror}</div>) : ('')
            }
          </div>) :
          (
            <div className="auth">
              <div className="logo">
              </div>

              <div className="mess">Вы вошли как: { localStorage.getItem('username') }</div>
              <div className="mess">Ваш id: { localStorage.getItem('userid') }</div>

              <div
                className="button"
                role="presentation"
                onClick={() => {
                  this.props.meSet({variables:{
                    meid: "",
                    mename: "",
                    memail: "",
                  }
                  });

                  localStorage.removeItem(AUTH_TOKEN)
                  localStorage.removeItem('username')
                  localStorage.removeItem('userid')
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

export default compose(
  graphql(meSet, { name: 'meSet' }),
  graphql(meGet, { name: 'meGet' }),
)(Login);
