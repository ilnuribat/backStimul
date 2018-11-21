import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../../newcss/column.css'
/** Column view */
import { Svg } from "../SVG/index";
import { UserRow } from '../Rows/Rows';

class Task extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  static propTypes = {
  }

  render() {

    const {children, name, id, endDate, lastMessage, click, childs, selected, deleteTask} = this.props;

    return(
      <div className={!selected ? "Task" : "Task Sel"} >
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
                    истекает:
              {endDate}
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
                {
                  lastMessage.text
                }
              </div>

            </div>
          ) : null
        }
        <div className="Bottom">
          {/* <div className="TaskUserPhoto"> */}
          <UserRow icon="1" box="1"/>
          {/* </div> */}
          <div className="Childs" onClick={()=>childs(id)}>
            <Svg svg="childs"></Svg>
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

