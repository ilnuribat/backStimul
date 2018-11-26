import React, { Component } from 'react'
import PropTypes from 'prop-types'


/* Left SideBar Container  */
export default class Bar extends Component {
  static propTypes = {
  }

  render() {

    let {children, view} = this.props;


    return (
      <div className={!view ? "Bar" : "Bar "+view}>
        {children}
      </div>
    )
  }
}
