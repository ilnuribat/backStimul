import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ModalStyle.css'
import Svg from '../../Parts/SVG'


export const ModalClose = ({ click })=>{
  return(
    <div className="ModalClose" onClick={()=>{click? click() : console.log("Modal close")}}>
      <Svg svg="close"></Svg>
    </div>
  )
}

export const ModalCol = ({ children })=>{
  return(
    <div className="ModalCol">
      {children}
    </div>
  )
}

export const ModalBlockName = ({ children })=>{
  return(
    <div className="ModalBlockName">
      {children}
    </div>
  )
}

export const ModalRow = ({ children })=>{
  return(
    <div className="ModalRow">
      {children}
    </div>
  )
}

export const InputWrapper = ({ children, name, save, placeholder, click, change })=>{
  let value = name;
  let old = name;

  return(
    <ModalCol>
      <ModalBlockName>
        {children}
      </ModalBlockName>
      <div className="InputWrapper">
        <input type="text" defaultValue={name||""} placeholder={placeholder||"" } onChange={(e)=>{value = e.target.value}} />
        { click ? ( <div className="SaveBtn" onClick={()=>{click(value)}}><Svg svg="save"/>{save||"Сохранить"}</div> ): null }
      </div>
    </ModalCol>
  )
}

class Modal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      value: "",
    }
  }


  static propTypes = {

  }

  render() {
    const { children, big, small, click, close, size, message } = this.props;

    return (
      <div className="ModalFull">
        <div className="ModalWrap">

          <div className="ModalBig" style={size ? {"maxWidth":size+"px"} : {} }>
            
            
            <ModalClose click={()=>{close ? close() : console.log("No close function") }}/>
            <div className="inner">
              {message?(<div className="ModalMessage">{message}</div>) : null}
              {children}

            </div>
          </div>
          {small?(
            <div className="ModalSmall">
              <div className="inner">
                <div className="ModalCol"></div>
              </div>
            </div>
          ): null}

        </div>

      </div>
    )
  }
}

Modal.propTypes = {
  close: PropTypes.func,
  small: PropTypes.func,
  big: PropTypes.func,
  click: PropTypes.func,
};


export default Modal
