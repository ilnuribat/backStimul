import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


export default class NavLinks extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="NavTop">
        {children}
      </div>
    )
  }
}
