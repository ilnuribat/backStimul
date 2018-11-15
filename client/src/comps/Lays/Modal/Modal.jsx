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

export const InputWrapper = ({ children, name, save, placeholder })=>{
  return(
    <ModalCol>
      <ModalBlockName>
        {children}
      </ModalBlockName>
      <div className="InputWrapper">
        <input type="text" defaultValue={name||""} placeholder={placeholder||""}/><div className="SaveBtn"><Svg svg="save"/>{save||"Сохранить"}</div>
      </div>
    </ModalCol>
  )
}

export const FileRow = ({ children, id, name, filename, url, fileid, icon, click, box })=>{
  return(
    <div className={!box ? "FileRow":"FileRow Boxed"} onClick={()=>{click ? click(fileid || id,url) : console.log("file", fileid||id,url )}}>
      <div className="FileIcon"><Svg svg={icon || "doc"} inline={1} /></div>
      <div className="FileName">{filename || name}</div>
    </div>
  )
}
export const IconRow = ({ children, id, name, url, icon, click, box })=>{
  return(
    <div className={!box ? "IconRow":"IconRow Boxed"} onClick={()=>{click ? click(id,url) : console.log("Row", id,url )}}>
      <div className="RowIcon" ><Svg svg={icon} /></div>
      <div className="RowName">{name}</div>
    </div>
  )
}
export const UserRow = ({ children, id, name, username, url, userid, icon, click, box })=>{
  return(
    <div className={!box ? "UserRow":"UserRow Boxed"} onClick={()=>{click ? click(userid || id,url) : console.log("file", userid||id,url )}}>
      <div className="UserIcon"><img src="0" /></div>
      <div className="UserName">{username || name}</div>
    </div>
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
    const { children, big, small, click, close } = this.props;

    return (
      <div className="ModalFull">
        <div className="ModalWrap">

          <div className="ModalBig">
            <ModalClose click={()=>{close ? close() : console.log("No close function") }}/>
            <div className="inner">

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
