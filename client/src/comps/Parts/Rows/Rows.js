import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ModalStyle.css'
import Svg from '../../Parts/SVG'

const FileRow = ({children, id, name, filename, url, fileid, icon, click})=>{
  return(
    <div className="FileRow" onClick={()=>{click ? click(fileid || id,url) : console.log("file", fileid||id,url )}}>
      <div className="FileIcon"><Svg svg={icon || "doc"} inline={1} /></div>
      <div className="FileName">{filename || name}</div>
    </div>
  )
}
const UserRow = ({children, id, name, filename, url, fileid, icon, click})=>{
  return(
    <div className="FileRow" onClick={()=>{click ? click(fileid || id,url) : console.log("file", fileid||id,url )}}>
      <div className="FileIcon"><Svg svg={icon || "doc"} inline={1} /></div>
      <div className="FileName">{filename || name}</div>
    </div>
  )
}