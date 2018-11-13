import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


export default class NavTopInner extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="NavTopInner">
        {children}
      </div>
    )
  }
}
