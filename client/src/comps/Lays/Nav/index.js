import React, { Component } from 'react'
import PropTypes from 'prop-types'

/* Left Navigation Container */

export default class Nav extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="Nav">
        {children}
      </div>
    )
  }
}
