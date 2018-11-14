import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ModalStyle.css'

class Modal extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  

  static propTypes = {

  }

  render() {
    let {children, } = this.props;
    return (
      <div className="ModalFull">
        <div className="ModalWrap">
          <div className="ModalBig"></div>
          <div className="ModalSmall"></div>
        </div>
        
      </div>
    )
  }
}

export default Modal
