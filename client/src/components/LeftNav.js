import React, { Component, Fragment } from 'react';
import Private from './Nav/Private';
import Groups from './Nav/Groups';
import Profile from './Nav/Profile';
import Board from './Nav/Board';

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
    }
  }

  hidePanel = () => {
  }

  render() {

    return (
      <Fragment>
        <nav className="left-nav">
          <Profile />
          <Groups />
          <Private />
          <Board />
        </nav>
      </Fragment>
    )
  }
}


export default LeftNav
