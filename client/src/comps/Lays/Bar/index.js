import React, { Component } from 'react'
import PropTypes from 'prop-types'


/* Left SideBar Container  */
export default class Bar extends Component {
  static propTypes = {
  }

  render() {

    console.log(this.props)
    let {children, view} = this.props;


    return (
      <div className={!view ? "Bar" : "Bar "+view}>
        {children}
      </div>
    )
  }
}
