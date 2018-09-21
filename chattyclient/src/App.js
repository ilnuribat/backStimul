import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const LOGIN_MUTATION = user => `
  mutation {
    login(user: ${user}) {
      id
      jwt
      username
    }
  }
`;


class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      input: [],
      user: false,
      loading: false,
    }

    this._input = this._input.bind(this);
    this._loginner = this._loginner.bind(this);
  }

  _input(e){

    let inp = this.state.input;
    let val = e.target.value;
    let num = Number(e.target.name);

    inp[num] = val;

    this.setState({
      input: inp,
    })
  }

  _loginner(){
    this.setState({loading: true})
    setTimeout(
      ()=>{
        this.setState({
          user: !this.state.user,
          loading: false,
        })
      }, 2500
    )
    
  }

  render() {
    
    if(this.state.loading){
      return(
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Загрузка</h1>
        </header>
        <div className="loader">
        <svg x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 100 100">
 <path fill="#222" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="2s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
 <path fill="#222" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
  c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="1s" 
         from="0 50 50"
         to="-360 50 50" 
         repeatCount="indefinite" />
  </path>
 <path fill="#222" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
  L82,35.7z">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="2s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
</svg>
        </div>
      </div>
      )
    }
    if(this.state.user){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to ShitHole</h1>
          </header>
          <div className="App-intro">
              Ты залогинен как <span className="videlator">Терминатор</span>
              <div class="btn" onClick={this._loginner}>Выйти</div>
          </div>
        </div>
      );
    }else{
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to HolyShit</h1>
          </header>
          <div className="App-intro">
            <div><input type="name" name="0" value={this.state.input[0]} placeholder="Email" onChange={this._input} /></div>
            <div><input type="name" name="1" value={this.state.input[1]} placeholder="Пароль" onChange={this._input} /></div>
            <div class="btn" onClick={this._loginner}>Войти</div>
          </div>
        </div>
      );
    }

  }
}

export default App;
