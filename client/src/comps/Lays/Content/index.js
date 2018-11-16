import React, { Component } from 'react'
import PropTypes from 'prop-types'

/** Content container */

export default class Content extends Component {
  static propTypes = {
  }

  render() {
    let {children, view} = this.props;

    return (
      <div className={"Content"+` ${view}`}>
        {children}
      </div>
    )
  }
}

