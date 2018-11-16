import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
// import './ModalStyle.css'
import { Link } from 'react-router-dom';
import Svg from '../../Parts/SVG'
import userDefault from '../../Img/UserDefault';

export const FileRow = ({ children, id, name, filename, url, fileid, icon, click, box, type })=>{
  return(
    <div className={!box ? "FileRow":"FileRow Boxed"} onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("file", fileid||id,url )}}>
      { icon ? (<div className="FileIcon"><Svg svg={icon || icon != 1 ? icon : "doc"} inline={1} /></div>):null}
      <div className="FileName">{filename || name}</div>
    </div>
  )
}
export const IconRow = ({ children, id, name, url, icon, click, box, size, type })=>{
  return(
    <div className={!box ? "IconRow":"IconRow Boxed"} onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("Row", id,url )}}>
      { icon ? (<div className="RowIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>):null}
      <div className="RowName">{name}</div>
    </div>
  )
}
export const UserRow = ({ children, id, name, username, url, userid, icon, click, box, size, type })=>{
  return(
    <div className={!box ? "UserRow":"UserRow Boxed"} onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("user", userid||id,url )}}>
      { icon ? (<div className="UserIcon" style={size ? {"width":size+'px',"maxWidth":size+'px',"maxHeight":size+'px', "height":size+'px'} : null}><img src={icon && icon != 1 ? icon : userDefault} /></div>):null}
      <div className="UserName">{username || name}</div>
    </div>
  )
}
export const ButtonRow = ({ children, id, name, url, icon, click, box, iconright, size, type })=>{
  return(
    <div className={!box ? "ButtonRow":"ButtonRow Boxed"} onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("button", id,url )}}>
      {icon && !iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
      <div className="ButtonName">{children || name}</div>
      {icon && iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
    </div>
  )
}
export const ButtonTo = ({ children, id, name, linkstate, linkurl, url, icon, click, box, iconright, size, type })=>{
  return(
    <div className={!box ? "ButtonTo":"ButtonTo Boxed"} onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("button", id,url,type )}}>
      {
        url ? (<Link to={{pathname: url, state:linkstate||""}} className="toBackLink">
          {icon && !iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
          <div className="ButtonName">{children || name}</div>
          {icon && iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
        </Link>) : (
          <Fragment>
            {icon && !iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
            <div className="ButtonName">{children || name}</div>
            {icon && iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
          </Fragment>
        )
      }
    </div>
  )
}


// <div className="TaskViewTop">
// <ButtonTo icon="back">Назад</ButtonTo>
// </div>
