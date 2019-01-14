import React, { Component } from 'react';
import { graphql, compose, Query  } from "react-apollo";


import { quf, AUTH_TOKEN } from '../../constants';
import { LoginQuery, USER_QUERY } from '../../GraphQL/Qur/Query';
// import { meGet, meSet } from '../../GraphQL/Cache';
import '../../css/lays/login.css'
import Content from '../Lays/Content/index';
import logoImg from '../Img/Logo';
import { UserRow } from '../Parts/Rows/Rows';
import Loading from '../Loading';


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

        // this.props.meSet({variables:{
        //   meid: id,
        //   mename: username,
        //   memail: username,
        // }
        // });
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
    const { loginerror } = this.state;
    // const { history, meGet, meSet } = this.props;
    const { history } = this.props;

    // console.warn("MeName",meGet.mename)

    return (
      <Content view="Master">
        <div className="LoginPage">
          {!authToken ? (
            <div className="auth">
              <div className="logo">
                <img src={logoImg} alt="АО ГУОВ" />
              </div>
              <label className="LabelInputText"><input type="text" placeholder="Email" onChange={(e) => { this.setState({ loginerror: "", email: e.target.value }) }} /></label>
              <label className="LabelInputText"><input type="password" placeholder="Пароль" onKeyDown={this.onKeyDown} onChange={(e) => { this.setState({ loginerror: "", password: e.target.value }) }} /></label>
              <div><div className="button" role="presentation" onClick={() => { this._confirm() }}>Войти</div></div>
              {
                loginerror ? (<div className="errorMessage">{loginerror}</div>) : ('')
              }
            </div>) :
            (
              <Query query={USER_QUERY}>
                {
                  ({ data, loading, error }) => {

                    if (loading) {
                      return <Loading></Loading>
                    }
                    if (error) {
                      console.warn('Error TOP', error.message);
                      // this.props.meSet({
                      //   variables: {
                      //     meid: "",
                      //     mename: "",
                      //     memail: "",
                      //   }
                      // });

                      localStorage.removeItem(AUTH_TOKEN)
                      localStorage.removeItem('username')
                      localStorage.removeItem('userid')
                      history.push(`/`)

                      return <Loading />
                    }
                    // if (data && data.userInfo ) console.warn("AAA", data.userInfo.name)

                    if (data && data.user) {

                      console.warn(data.user)

                      return(
                        <div className="Profile auth">
                          <div className="ProfileInner">
                            <div className="authTop">
                              {/* <div className="logo">
                      <img src={logoImg} alt="АО ГУОВ" width="20px"/>
                    </div> */}
                              <UserRow size="120" icon={data.user.icon || "1"} name=" "><h1>{data.user.name}</h1></UserRow>
                            </div>
                            <div className="authContent">
                              <div className="authColumn">
                                <div className="authRow">
                                  <div className="authRowName">Управление</div>
                                  <div className="authRowContent">{data.user.company}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Наименование подразделения</div>
                                  <div className="authRowContent">{data.user.department}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Должность</div>
                                  <div className="authRowContent">{data.user.title}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Кабинет</div>
                                  <div className="authRowContent">{"302-А"}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Внутренний телефон</div>
                                  <div className="authRowContent">{"12-29"}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Идентификатор</div>
                                  <div className="authRowContent">{localStorage.getItem('userid')}</div>
                                </div>
                              </div>
                              <div className="authColumn">
                                <div className="authRow">
                                  <div className="authRowName">Адрес электронной почты</div>
                                  <div className="authRowContent">{data.user.mail}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Мобильный телефон</div>
                                  <div className="authRowContent">{"+7 (999) 999-99-99"}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Рабочий телефон</div>
                                  <div className="authRowContent">{"+7 (495) 495-95-96"}</div>
                                </div>
                                <div className="authRow">
                                  <div className="authRowName">Адрес</div>
                                  <div className="authRowContent">{"123022, г.Москва, Б.Предтеченский пер., д.30, стр.1"}</div>
                                </div>

                              </div>

                            </div>
                            <div className="authBottom">
                              <div
                                className="button"
                                role="presentation"
                                onClick={() => {
                                  // this.props.meSet({
                                  //   variables: {
                                  //     meid: "",
                                  //     mename: "",
                                  //     memail: "",
                                  //   }
                                  // });

                                  localStorage.removeItem(AUTH_TOKEN)
                                  localStorage.removeItem('username')
                                  localStorage.removeItem('userid')
                                  history.push(`/`)
                                }}
                              >
                                Выйти
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  }
                }
              </Query>
            )}
        </div>
      </Content>
    )
  }
}

export default Login