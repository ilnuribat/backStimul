import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SvgPlusBox } from '../SVG';
import Tiled from '../Tiled/index';

/** Root container */

class TileMaker extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      edit:false,
    }

    this.edit = this.edit.bind(this)
  }
  

  static propTypes = {
  }
  edit(){
    let { edit } = this.state;
    this.setState({edit: !edit})
  }

  render() {
    let { children } = this.props;
    let { edit } = this.state;
    if(edit){
      return(
        <div className="Tile Edit">
          <input type="text" placeholder="Название" ></input>
          <input type="text" placeholder="Адрес" ></input>
        </div>
      )
    }else{
      return (
        <Tiled click={this.edit}>
          <SvgPlusBox />
        </Tiled>
      )
    }

  }
}
export default TileMaker