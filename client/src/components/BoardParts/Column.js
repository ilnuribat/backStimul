import React from 'react';
import { Link } from 'react-router-dom';
import MakeTask from './MakeTask'

const Column = ({...props})=>{

  return(
    <div className="column animated fadeIn">
      <div className="column-name">{props.name}</div>
      <div className="column-content">
        {
          props.tasks && props.tasks.map((e)=>{
            let obj = {id: e.id, name: e.name };
            let time = "";

            if(e.endDate){
              time = e.endDate;
              time = time.replace(/T.*$/gi, "");
            }


            return(
              <div key={e.id} className="task animated fadeIn">
                <div className="taskHead head-link" onClick={()=>props.selectTask(obj)} data-id={e.id} taskid={e.id}>{e.name}</div>
                <div className="small">{e.id}</div>


                <div className="pWrapper">
                  <div className="mini">Дата завершения:</div>
                  <div className="cntr">{time ? (<span className="endDate-red">{time}</span>) : "Не указано" }</div>

                </div>
                <div className="pWrapper">
                  <div className="assignedTo"><div className="mini">Ответственный:</div><div className="userCloud">
                    {e.assignedTo ? e.assignedTo.username : "не назначен" }
                  </div>
                  </div>
                </div>

                {e.lastMessage ? (
                  <div className="pWrapper">
                    <div className="mini">Последнее сообщение:</div>
                    <div className="lastMessage">
                      <span className="userCloud">{e.lastMessage.from.username}:</span>
                      <span className="messageCloud">{e.lastMessage.text}</span></div>
                  </div>
                ) : null
                }

                <div className="pWrapper">
                  <Link to="/task">
                    <div className="button" onClick={()=>props.selectTask(obj)} >Открыть</div>
                  </Link>
                </div>
              </div>
            )
          })
        }
      </div>
      {props.first ? (<MakeTask />) : null }

    </div>
  )
};

export default Column
