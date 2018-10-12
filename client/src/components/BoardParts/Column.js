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
                {e.lastMessage ? (<div className="lastMessage">{e.lastMessage.from.username}: {e.lastMessage.text}</div>) : null }
              </div>
            )
          })
        }
      </div>
    </div>
  )
};

export default Column;