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
    }

    this._input = this._input.bind(this);
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

  render() {

    if(this.state.user){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to ShitHole</h1>
          </header>
          <div className="App-intro">
              Ты залогинен как <span className="videlator">Терминатор</span>
              <div class="btn" onClick={()=>{this.setState({user: !this.state.user})}}>Выйти</div>
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
            <div class="btn" onClick={()=>{this.setState({user: !this.state.user})}}>Войти</div>
          </div>
        </div>
      );
    }

  }
}

export default App;
