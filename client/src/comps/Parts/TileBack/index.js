import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SvgPlusBox } from '../SVG';

/** Root container */

class TileMaker extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="TileMaker">
        <SvgPlusBox />
      </div>
    )
  }
}
export default TileMaker