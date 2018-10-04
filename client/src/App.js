import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
// import Drafts from './components/Drafts';
// import DraftGroup from './components/DraftGroup';
// import Board from './components/Board';
// import Home from './components/Home';
// import Card from './components/Card';
import LeftNav from './components/LeftNav';

// import nComponent from './components/nComponent';
// import gql from 'graphql-tag';
import Login from './components/Login';
import Profile from './components/Profile';
import New from './components/New';
import Private from './components/Private';
// import { stat } from 'fs';

import { AUTH_TOKEN } from './constants';
// import FirstLayout from './components/Layout';



export const qf = (_url, ...params) => {
  return fetch(_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      params
    })
  })
    .then(r => r.json())
    .then(data => console.warn("quf data", data))
    .then(data => data)
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // email: '',
      // password: '',
      // name: '',
      // logged: false,
      // lbar: true,
      barstate: 'chat',
      // user: true,
      // gid:'',

    };
    this._lbarstate = this._lbarstate.bind(this);
    this.lookft = this.lookft.bind(this);
    this.barstate = this.barstate.bind(this);

  }

  componentDidMount() {
    let user = localStorage.getItem('username');

    if (!user) {
      this.setState({ logged: false });
    } else {
      this.setState({ logged: true });
    }
  }

  _lbarstate = (state) => {
    const {barstate} = this.state

    if (barstate === state) {
      this.setState({
        // lbar: !this.state.lbar,
        barstate: state,
      })
    } else {
      this.setState({
        // lbar: true,
        barstate: state,
      })
    }
  }

  barstate = (state) => {
    const {barstate} = this.state

    if (barstate === state) {
      this.setState({
        // lbar: !this.state.lbar,
        barstate: state,
      })
    } else {
      this.setState({
        // lbar: true,
        barstate: state,
      })
    }
  }

  // logState(value) {
  //   this.setState({ logged: value });
  // }

  lookft() {
    let authToken = localStorage.getItem(AUTH_TOKEN)

    if (authToken) {
      this.setState({
        user: true,
      })
    }

  }

  render() {
    // let username = '';
    // let logged = this.state.logged;
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <Fragment>
        {!authToken ? (
          <Login lookft={this.lookft} />
        ) : (
          <Fragment>
            <LeftNav lstate={this._lbarstate} />
            <Switch>
              {/* <Route exact path="/" component={Home} /> */}
              <Route exact path="/login" component={Login} />
              {/* <Route exact path="/projectgroup/:id" component={DraftGroup} />
                  <Route exact path="/projects/:id" component={Drafts} />
                  <Route exact path="/project/:id" component={Board} />
                  <Route exact path="/card/:id" component={Card} /> */}
              {/* <Route exact path="/:type/:id" component={nComponent} />
                  <Route exact path="/:type" component={nComponent} /> */}
              {/* <Route exact path="/" component={nComponent} /> */}
              {/* <Route exact path="/" component={New} /> */}
              <Route exact path="/" render={(props) => <New {...props} />} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/private" render={(props) => <Private {...props} />} />
            </Switch>
          </Fragment>
        )
        }
      </Fragment>
    )
  }
}

export default withRouter(App);




