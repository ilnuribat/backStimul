import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../../newcss/column.css'
/** Column view */
import { Svg } from '../../Parts/SVG/index';

class Task extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
    }
  }

  static propTypes = {
  }

  render() {

    let {children, name, id, endDate, lastMessage, click, childs} = this.props;

      return( 
            <div className="Task" >
            <div style={{"display":"none"}}>
              {
                id
              }
            </div>
            <div className="Name" onClick={()=>click(id)}>
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
              <div className="TaskUserPhoto"></div>
              <div className="Childs" onClick={()=>childs(id)}>
                <Svg svg="deps"></Svg>
              </div>
            </div>
            <div className="linked" onClick={()=>click(id)}>
              открыть
            </div>
            </div>
      )
  }
}
export default Task;

