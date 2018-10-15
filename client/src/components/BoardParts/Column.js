import React from 'react';
import { Link } from 'react-router-dom';

const Column = ({...props})=>{
  return(
    <div className="column animated fadeIn">
      <div className="column-name">{props.name}</div>
      <div className="column-content">
        {
          props.tasks.map((e)=>{
            let obj = {id: e.id, name: e.name }

            return(
              <div key={e.id} className="task animated fadeIn">
                <Link to="/">
                  <div className="head-link" onClick={()=>props.selectTask(obj)} data-id={e.id} taskid={e.id}>{e.name}</div>
                </Link>  
                
                <div className="small">{e.id}</div>
                <div className="assignedTo"><span className="messageCloud">Ответственный:</span><span className="userCloud">
                  {e.assignedTo ? e.assignedTo : "не назначен" }
                </span></div>
                  {e.lastMessage ? (<div className="lastMessage">
                    <span className="userCloud">{e.lastMessage.from.username}:</span>
                    <span className="messageCloud">{e.lastMessage.text}</span></div>) : null 
                  }
                </div>
            )
          })
        }
      </div>
    </div>
  )
};

export default Column;