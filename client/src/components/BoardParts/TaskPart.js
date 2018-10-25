import React from 'react';
import { Link } from 'react-router-dom';

const Column = ({...props})=>{
  return(
    <div key={props.id} className="task animated fadeIn">
                
      <div className="head-link" onClick={()=>props.obj} data-id={props.id} taskid={props.id}>{props.name}</div>
                
      <div className="small">{props.id}</div>
      {props.lastMessage ? (<div className="lastMessage"><span className="userCloud">{props.username}:</span><span className="messageCloud">{props.text}</span></div>) : null }

      <div className="buttonWrapper">
        <Link to="/">
          <div className="btn" onClick={()=>props.obj}>Открыть</div>
        </Link>
      </div>
    </div>
  )
};

export default Column;