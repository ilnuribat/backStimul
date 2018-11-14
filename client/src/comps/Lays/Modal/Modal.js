import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ModalStyle.css'
import Svg from '../../Parts/SVG'


const ModalClose = ({click})=>{
  return(
    <div className="ModalClose" onClick={()=>{click? click() : console.log("Modal close")}}>
      <Svg svg="close"></Svg>
    </div>
  )
}
const ModalCol = ({children})=>{
  return(
    <div className="ModalCol">
      {children}
    </div>
  )
}
const ModalBlockName = ({children})=>{
  return(
    <div className="ModalBlockName">
      {children}
    </div>
  )
}
const ModalRow = ({children})=>{
  return(
    <div className="ModalRow">
      {children}
    </div>
  )
}
const InputWrapper = ({children})=>{
  return(
    <div className="InputWrapper">
      {children}
    </div>
  )
}
const FileRow = ({children, id, name, filename, url, fileid, icon, click})=>{
  return(
    <div className="FileRow" onClick={()=>{click ? click(fileid || id,url) : console.log("file", fileid||id,url )}}>
      <div className="FileIcon"><Svg svg={icon || "doc"} inline={1} /></div>
      <div className="FileName">{filename || name}</div>
    </div>
  )
}
const UserRow = ({children, id, name, username, url, userid, icon, click})=>{
  return(
    <div className="UserRow" onClick={()=>{click ? click(userid || id,url) : console.log("file", userid||id,url )}}>
      <div className="UserIcon"><img src="0" /></div>
      <div className="UserName">{username || name}</div>
    </div>
  )
}


class Modal extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  

  static propTypes = {

  }

  render() {
    let {children, big, small, click, close } = this.props;
    return (
      <div className="ModalFull">
        <div className="ModalWrap">

          <div className="ModalBig">
            <ModalClose click={()=>{close ? close() : console.log("No close function") }}/>
            <div className="inner">
              <ModalCol>
                <ModalBlockName>
                  Название
                </ModalBlockName>
                <InputWrapper>
                  <input type="text"/><div className="SaveBtn"></div>
                </InputWrapper>
              </ModalCol>

              <ModalRow>
                <ModalCol>
                  <ModalBlockName>
                    Статус
                  </ModalBlockName>
                  <label htmlFor="">
                    <select name="" id="">
                      <option value="">Новое</option>
                      <option value="">В работе</option>
                      <option value="">На проверке</option>
                      <option value="">Завершено</option>
                    </select>
                  </label>
                </ModalCol>
                <ModalCol>
                  <ModalBlockName>
                    Ответственный
                  </ModalBlockName>
                  <UserRow id="123" name="В.И. Гашков" />
                </ModalCol>

              </ModalRow>
              <ModalRow>
                <ModalCol>
                  <div className="ModalBlockName">
                    Срок истечения
                  </div>
                  <label htmlFor="">
                    <input type="date"/>
                  </label>
                </ModalCol>

                <ModalCol>
                  <ModalBlockName>
                    Добавить задачу
                  </ModalBlockName>
                  <label htmlFor="">
                    <select name="" id="">
                      <option value="">1</option>
                      <option value="">2</option>
                      <option value="">3</option>
                      <option value="">4</option>
                    </select>
                  </label>
                </ModalCol>
              </ModalRow>
              <ModalCol>
                <ModalBlockName>
                  Добавить вложения
                </ModalBlockName>
                  <FileRow name="Смета_проекта.doc" id="id1235" icon="doc" />
                  <FileRow name="Фото подвала.jpg" id="id1237" icon="img" />
                <ModalCol>
                  <div className="files-drop">
                    <Svg svg="tocloud" inline={0} />переместите файлы сюдa
                  </div>
                </ModalCol>
              </ModalCol>

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

export default Modal
