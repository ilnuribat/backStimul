import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import NavTopInner from './NavTopInner';


export default class NavTop extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="NavTop">
        <div><Link to="/profile">top</Link></div>
        {/* <NavTopInner/> */}
        {children}
        
      </div>
    )
  }
}
