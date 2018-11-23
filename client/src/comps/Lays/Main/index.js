import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Main extends Component {
  static propTypes = {
  }

  render() {

    let {children} = this.props;


    return (
      <div className="Main">
        {children}
      </div>
    )
  }
}
