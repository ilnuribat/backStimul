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

    const {children, name, id, endDate, lastMessage, click, childs, selected, selectedChilds, deleteTask, showother, status} = this.props;
    let sel = "";
    let oth = "";
    let statusShit = 'истекает:';
    let highlight = '';

    if(selected || selectedChilds){
      sel = " Sel";
    }
    if(showother){
      oth = " Child"
    }

    if(endDate){
      let ym = moment(endDate).format("YYYY MM");
      let y = moment(endDate).format("YYYY");
      let m = moment(endDate).format("MM");
      let d = moment(endDate).format("DD");
      let h = moment(endDate).format("HH");
      
      let ymN = moment().format("YYYY MM");
      let yN = moment().format("YYYY");
      let mN = moment().format("MM");
      let dN = moment().format("DD");
      let hN = moment().format("HH");


      if((ym === ymN && d < dN ) || (yN > y ) || ( mN > m && y <= yN ) && status != '5'){
        highlight = " RedBg"
        statusShit = 'истекла:'
      }
      else if((ym === ymN && d > dN && d - dN <= 3 ) && status != '5'){
        highlight = " YlBg"
      }else{
        highlight = 'gr'
      }
    }

    return(
      <div className={`Task${sel}${oth}`} >
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
            <div className={`endDate`}>
              <span className={`endDateHL ${highlight}`}>
                  <span className="Pad">{statusShit}</span>
                  {moment(endDate).format('D MMMM, h:mm')}
              </span>
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
                  lastMessage.text ? lastMessage.text.length > 50 ? lastMessage.text.substring(0, 50) + "..." : lastMessage.text : "noname"  
                }"
              </div>

            </div>
          ) : null
        }
        <div className="Bottom">
          {/* <div className="TaskUserPhoto"> */}
          <UserRow icon="1" box="1"/>
          {/* </div> */}

          {childs ? (
            <div className="Childs" onClick={() => childs(id)}>
              {!selectedChilds ? <Svg svg="childs" size="34" /> : <div className="" onClick={() => childs('')}>Скрыть подзадачи</div>}
            </div>
          ) : null

          }

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

