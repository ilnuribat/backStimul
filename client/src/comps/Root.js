import React, { Component } from 'react'
import PropTypes from 'prop-types'

/** Root container */

class Root extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="Root">
        {children}
      </div>
    )
  }
}
export default Root