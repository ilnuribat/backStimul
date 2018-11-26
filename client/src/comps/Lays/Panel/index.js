import React, { Component } from 'react'
import PropTypes from 'prop-types'

/** Right Panel SideBar Container */

export default class Panel extends Component {
  static propTypes = {
  }

  render() {

    let {children} = this.props;


    return (
      <div className="Panel">
        {children}
      </div>
    )
  }
}
