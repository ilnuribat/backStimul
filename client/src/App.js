import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { AUTH_TOKEN } from './constants';

import 'tachyons';
import './index.css';

import Root from './comps/Root';
import Nav from './comps/Lays/Nav';
import Map from './comps/Views/Map';
import Profile from './comps/Views/Profile';
import Board from './comps/Views/Board';
import TaskView from './comps/Views/TaskView';
import TileBoard from './comps/Views/TileBoard';
import ChatView from './comps/Views/ChatView';
import Login from './comps/Views/Login';

import RootLoader from './comps/RootLoader';
import NavLinks from './comps/Views/NavLinks';
import NavTop from './comps/Views/NavTop';


const Components = [
  {name:'', link: ''},
  {name:'', link: ''},
  {name:'', link: ''},
  {name:'', link: ''},
];

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
            <Nav>
              <NavTop/>
              <NavLinks />
            </Nav>
            <Root>
              <Switch>

                {
                  // Components.map((e,i)=>{
                  //   return(
                  //     <Route exact path={e.link} component={e.name} />
                  //   )
                  // })
                }
                <Route exact path="/task" component={TaskView} />
                <Route exact path="/board" component={Board} />
                <Route exact path="/tile" component={TileBoard} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/map" component={Map} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/chats" component={ChatView} />
                <Route exact path="/" component={RootLoader} />
              </Switch>
            </Root>
          </Fragment>
        )
        }
      </Fragment>
    )
  }
}

export default withRouter(App);




