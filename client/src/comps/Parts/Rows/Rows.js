import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import './ModalStyle.css'
import Svg from '../../Parts/SVG'


export const FileRow = ({ children, id, name, filename, url, fileid, icon, click, box })=>{
  return(
    <div className={!box ? "FileRow":"FileRow Boxed"} onClick={()=>{click ? click(fileid || id,url) : console.log("file", fileid||id,url )}}>
      { icon ? (<div className="FileIcon"><Svg svg={icon || icon != 1 ? icon : "doc"} inline={1} /></div>):null}
      <div className="FileName">{filename || name}</div>
    </div>
  )
}
export const IconRow = ({ children, id, name, url, icon, click, box })=>{
  return(
    <div className={!box ? "IconRow":"IconRow Boxed"} onClick={()=>{click ? click(id,url) : console.log("Row", id,url )}}>
      { icon ? (<div className="RowIcon" ><Svg svg={icon} /></div>):null}
      <div className="RowName">{name}</div>
    </div>
  )
}
export const UserRow = ({ children, id, name, username, url, userid, icon, click, box })=>{
  return(
    <div className={!box ? "UserRow":"UserRow Boxed"} onClick={()=>{click ? click(userid || id,url) : console.log("file", userid||id,url )}}>
      { icon ? (<div className="UserIcon"><img src="0" /></div>):null}
      <div className="UserName">{username || name}</div>
    </div>
  )
}
export const ButtonRow = ({ children, id, name, url, icon, click, box, iconright })=>{
  return(
    <div className={!box ? "ButtonRow":"ButtonRow Boxed"} onClick={()=>{click ? click(id,url) : console.log("file", id,url )}}>
      {icon && !iconright ? (<div className="ButtonIcon"><Svg svg={icon} /></div>): null}
      <div className="ButtonName">{children || name}</div>
      {icon && iconright ? (<div className="ButtonIcon"><Svg svg={icon} /></div>): null}
    </div>
  )
}