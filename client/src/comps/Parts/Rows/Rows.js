import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ModalStyle.css'
import Svg from '../../Parts/SVG'


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