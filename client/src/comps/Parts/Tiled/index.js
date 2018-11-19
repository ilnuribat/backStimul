import React, { Component } from 'react'
import PropTypes from 'prop-types'


/** Root container */

class Tiled extends Component {
  static propTypes = {
  }

  render() {
    let {children, click, id, type} = this.props;

    return (
      <div className="Tiled" type={type} onClick={()=>click(id, type)}>
        {/* {id} */}
        {children}
      </div>
    )
  }
}
export default Tiled