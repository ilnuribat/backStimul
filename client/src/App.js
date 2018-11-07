import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import LeftNav from './components/LeftNav';
import Login from './components/Login';
import Profile from './components/Profile';
import TaskView from './components/TaskView';
import BoardView from './components/BoardView';
import Root from './components/Root';
import Private from './components/Private';
import Map from './components/Map/LeafletMapBuild';
import { AUTH_TOKEN } from './constants';
import TileBoard from './components/TileBoard';


// export const qf = (_url, ...params) => {
//   return fetch(_url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     },
//     body: JSON.stringify({
//       params
//     })
//   })
//     .then(r => r.json())
//     .then(data => console.warn("quf data", data))
//     .then(data => data)
// };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barstate: '',
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
        barstate: state,
      })
    } else {
      this.setState({
        barstate: state,
      })
    }
  }

  barstate = (state) => {
    const {barstate} = this.state

    if (barstate === state) {
      this.setState({
        barstate: state,
      })
    } else {
      this.setState({
        barstate: state,
      })
    }
  }

  lookft() {
    let authToken = localStorage.getItem(AUTH_TOKEN)

    if (authToken) {
      this.setState({
        user: true,
      })
    }

  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <Fragment>
        {!authToken ? (
          <Login lookft={this.lookft} />
        ) : (
          <Fragment>
            <LeftNav lstate={this._lbarstate} client={this.props.client} />
            <Switch>
              <Route exact path="/board" component={BoardView} />
              <Route exact path="/top" component={TileBoard} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/map" component={Map} />
              <Route exact path="/" render={(props) => <Root {...props} />} />
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




