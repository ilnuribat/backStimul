import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
// import './ModalStyle.css'
import { Link } from 'react-router-dom';
import Svg from "../SVG"
import userDefault from '../../Img/UserDefault';

export const FileRow = ({ children, id, name, filename, url, fileid, icon, click, box, type, view, ondelete })=>{
  return(
    <div className={`FileRow${view?" "+view:""}`}>
      { icon ? (<div className="FileIcon" onClick={()=>{click ? click({id:id,name:name,url:url,type:type}) : console.log("file", fileid||id,url )}}><Svg svg={icon || icon != 1 ? icon : "doc"} inline={1} /></div>):null}
      { filename || name ? (<div className="FileName" onClick={()=>{click ? click({id:id,name:name,url:url,type:type}) : console.log("file", fileid||id,url )}}>{filename || name}</div>):null}
      {children}
      { ondelete && typeof ondelete === 'function' ? (<Svg svg="cancel" view="ondelete" click={()=>ondelete(id)} />) : null}
    </div>
  )
}


export const TextRow = ({ children, name, text, view, ondelete, click, id })=>{
  return(
    <div className={!view ? "TextRow" : "TextRow "+view }>
      {name ? (<div className="TextRowName" onClick={()=>{click ? click({name:name,text:text}) : console.log("TextRow", name )}}>{name}</div>):null}
      {text ? (<div className="TextRowText" onClick={()=>{click ? click({name:name,text:text}) : console.log("TextRow", text )}}>{text}</div>):null}
      {children ? children :null}
      { ondelete && typeof ondelete === 'function' ? (<Svg svg="cancel" view="ondelete" click={()=>ondelete(id)} />) : null}
    </div>
  )
}
export const IconRow = ({ children, id, name, url, icon, click, box, size, type, view, ondelete })=>{
  return(
    <div className={`IconRow${view?" "+view:""}`}>
      { icon ? (<div className="RowIcon" onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("Row", id,url )}} style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>):null}
      {name? (<div className="RowName" onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("Row", id,url )}}>{name}</div>):null}
      {children}
      { ondelete && typeof ondelete === 'function' ? (<Svg svg="cancel" view="ondelete" click={()=>ondelete(id)} />) : null}
    </div>
  )
}
export const UserRow = ({ children, id, name, iconright, username, url, userid, icon, click, box, size, type, view, ondelete })=>{
  let IconBody = () =>{
    return(<div className={box?"UserIcon Boxed":"UserIcon"} style={size ? {"width":size+'px',"maxWidth":size+'px',"maxHeight":size+'px', "height":size+'px',"minWidth":size+'px',"minHeight":size+'px'} : null}  onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("user", userid||id,url )}}>
      <img src={icon && icon != 1 ? icon : userDefault} alt={username || name} /></div>)
  } ;


  return(
    <div className={`UserRow${view?" "+view:""}`}>
      { icon && !iconright ? (<IconBody/>):null}
      {/* <div className="RowBlock"> */}
      { username || name ? (<div className="UserName" onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("user", userid||id,url )}}>{username || name}
        { children ? (children):null}
      </div>):null}
          
      {/* </div> */}
      { icon && iconright ? (<IconBody/>):null}
      { ondelete && typeof ondelete === 'function' ? (<Svg svg="cancel" view="ondelete" click={()=>ondelete(id)} />) : null}
    </div>
  )
}
export const ButtonRow = ({ children, id, name, url, icon, click, box, iconright, size, type, view })=>{
  return(
    <div className={`ButtonRow${view ? " " + view : ""}`} onClick={() => { click ? click({ id: id, url: url, type: type }) : console.log("button", id, url) }} >
      {icon && !iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
      {children || name ? (<div className="ButtonName">{children || name}</div>):null}
      {icon && iconright ? (<div className="ButtonIcon" style={size ? {"width":size+'px', "height":size+'px'} : null}><Svg svg={icon} /></div>): null}
    </div>
  )
}
export const ButtonTo = ({ children, id, name, linkstate, linkurl, url, icon, click, box, iconright, size, type, view  })=>{
  return(
    <div className={`ButtonTo${view?" "+view:""}`} onClick={()=>{click ? click({id:id,url:url,type:type}) : console.log("button", id,url,type )}}>
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

export const InputTextRow = ({ rightside, placeholderValue, children, change, def, click, type, view }) => {
         return <label className={"InputTextRow" + (view ? " " + view : "")}>
             {!rightside && children ? children : null}
             <input type={type ? type : "text"} vlaue={def} placeholder={placeholderValue ? placeholderValue : "Введите текст"} onClick={click && typeof click === "function" ? e => {
                       click(e);
                     } : null} onChange={change && typeof change === "function" ? e => {
                       change(e);
                     } : null} />
             {rightside && children ? children : null}
           </label>;
       };

export class ResponsibleRow extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      open: false,
    }
  }

  render() {
    const { open } = this.state;
    const { children, view, close } = this.props;

    if(open){
      return (
        <div className={!view ? 'ResponsibleRow' : 'ResponsibleRow '+view}>
          { children[1] }
          <Svg svg="cancel" view="ondelete" click={()=>this.setState({open: !open})} />
        </div>
      )
    }else{
      return(<div className={!view ? 'ResponsibleRow' : 'ResponsibleRow '+view} onClick={()=>this.setState({open: !open})}>{children[0]}</div>)

    }
  }
}



// <div className="TaskViewTop">
// <ButtonTo icon="back">Назад</ButtonTo>
// </div>
