import React from 'react';
import { Link } from 'react-router-dom';

const Column = ({...props})=>{
  return(
              <div key={props.id} className="task animated fadeIn">
                <Link to="/">
                  <div className="head-link" onClick={()=>props.obj} data-id={props.id} taskid={props.id}>{props.name}</div>
                </Link>  
                
                <div className="small">{props.id}</div>
                {props.lastMessage ? (<div className="lastMessage"><span className="userCloud">{props.username}:</span><span className="messageCloud">{props.text}</span></div>) : null }
              </div>
  )
};

export default Column;