import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Svg from '../../Parts/SVG';

/** Right Panel SideBar Container */

export default class Panel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true,
    }
  }


  static propTypes = {
  }

  render() {

    let {open} = this.state;
    let {children} = this.props;
    let view = "";

    open ? view = "" : view = " Closed"

    return (
      <div className={"Panel" + view} onClick={() => { view === " Closed" && this.setState({ open: !open }) }}>
        <div className="MenuB" onClick={()=>this.setState({open: !open})}> <Svg svg="menu" size="24" /> </div>
        {children}
      </div>
    )
  }
}
