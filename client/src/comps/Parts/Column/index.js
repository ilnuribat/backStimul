import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../../newcss/column.css'
/** Column view */

class Column extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
    }
  }

  static propTypes = {
  }

  render() {

    let {children, name, id} = this.props;

      return( 
        <div className="Column">
          <div className="Column-Name">{name}</div>
          <div className="Column-Id">{id}</div>
          <div className="Column-Content">
            <div className="Column-Content-Inner">
              {children}
            </div>
          </div>
        </div>
      )
  }
}
export default Column