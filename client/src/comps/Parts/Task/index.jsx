import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../../newcss/column.css'
/** Column view */
import { Svg } from "../SVG/index";
import { UserRow } from '../Rows/Rows';
import moment from 'moment';

class Task extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  static propTypes = {
  }

  render() {

    const {children, name, id, endDate, lastMessage, click, childs, selected, deleteTask, showother} = this.props;

    return(
      <div className={!selected ? !showother ? "Task" : "Task Child" : "Task Sel" } >
        <div style={{"display":"none"}}>
          {
            id
          }
        </div>
        <div className="Name" onClick={()=>click(id, name)}>
          {
            name
          }
        </div>
        {
          endDate ? (
            <div className="endDate">
              <span className="Pad">истекает:</span> 
              { moment(endDate).format('D MMMM, h:mm')}
            </div>
          ): null
        }

        {
          lastMessage ? (
            <div className="TaskChat">
              <div className="ChatName">
                {
                  lastMessage.from.username
                }
              </div>
              <div className="ChatMessage">
                "{
                  lastMessage.text.substring(0, 50) + "..." 
                }"
              </div>

            </div>
          ) : null
        }
        <div className="Bottom">
          {/* <div className="TaskUserPhoto"> */}
          <UserRow icon="1" box="1"/>
          {/* </div> */}
          <div className="Childs" onClick={()=>childs(id)}>
            {!selected ? <Svg svg="childs"></Svg> : <div className="" onClick={()=>childs('')}>Скрыть подзадачи</div>}
          </div>
        </div>
        <div className="Delete" onClick={()=>deleteTask(id)}>
          <Svg svg="cancel" size="12"></Svg>
            
        </div>
        {/* <div className="linked" onClick={()=>click(id, name)}>
              открыть
            </div> */}
      </div>
    )
  }
}
export default Task;

