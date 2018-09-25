import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { quf } from '../constants';
import Appср from '../chat/App';
import { updTask, getPriority, getById, crTask } from '../graph/querys';
let filename = "file: Card";
let log = (fun, e) => {
  console.warn(filename, "func:", fun, e)
};



export default class Column extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      key: 0,
      opncr: false,
      open: false,
      input: [],
      taskEdit: {},
    };

    this._crTask = this._crTask.bind(this);
    this._opencr = this._opencr.bind(this);
    this._closecr = this._closecr.bind(this);
    this._input = this._input.bind(this);
    this.taskEdit = this.taskEdit.bind(this);

  }

  _crTask() {


    
    let name = this.state.input[0];
    let description = this.state.input[1];
    let columnId = this.props.id;
    // let priority = this.state.input[3];
    // let createdBy = this.state.input[4];
    // name description columnId priority createdBy
    let input = `name: "${name}", description: "${description}", columnId: ${columnId}, priority: ${1}, createdBy: ${1}`;
    let q = crTask(`input: {${input}}`);

    quf(q)
      .then((a) => {
        console.warn(a)
      });
      this.props.refetch();
      this.setState({
      open: !this.state.open,
      input: [],
    })
  }

  _mutTask(id, input) {
    let q = updTask(id, `input: {${input}}`);

    console.warn(q)
    quf(q)
      .then((a) => {
        console.warn(a)
      });
  }
  
  _input(e){
    let inp = this.state.input;
    let val = e.target.value;
    let num = Number(e.target.name);

    inp[num] = val;

    this.setState({
      input: inp,
    })
  }

  _opencr(){

    this.setState({
      open: !this.state.open,
    })
  }

  _closecr(){
    this.setState({
      open: !this.state.open,
    })
  }

  taskEdit(id, name, description){
    let taskEdit = this.state.taskEdit;
    taskEdit.id = id;
    taskEdit.name = name;
    taskEdit.description = description;

    this.setState({
      taskEdit: taskEdit,
    })
  }


  _qPriority() {
    quf(getPriority)
      .then((a) => {
        if (a.data) {
          this.setState({
            priority: a.data.glossary.priorities
          })

          return a.data.glossary.priorities;
        } else {
          return false;
        }
      })
      .catch((e) => {
        log("getPriority", e);
      });
  }

  componentWillMount() {
    let id = this.props.id;
    let q = getById(id);

    quf(q)
      .then((a) => {
        if (a.data) {
          console.warn("a log", a)
          this.setState({
            id: this.props.id,
            task: a.data.task,
            dataGet: true,
            selectNewState: a.data.task.columnId,
            prior: a.data.task.priority,
          })
        } else {
          return false;
        }
      })
      .catch((e) => {
        log("getById", e);
      });
    this._qPriority();
  }


  editName() {
    this.setState({
      editName: true,
    })
  }

  changeName(e) {
    let val = e.target.value;

    this.setState(prevState => ({
      task: {
        ...prevState.task,
        name: val
      }
    }))
  }

  changeDescription(e) {
    let val = e.target.value;

    this.setState(prevState => ({
      task: {
        ...prevState.task,
        description: val
      }
    }))
  }




  render(){
    let type = '';
    let projgrlen = '';
    let projlen = '';
    let collen = '';

    return(
      <div className="nBoard">

      <div className="nBoardS">
      <div className="nBoard-inner">
        {
          this.props.full.columns.map((cr,ci,ca)=>{
            return(
              <div className="column-list">
                <div className="column-list-name">{cr.name}</div>
                <div className="column-list-content">
                <div className="column-list-inner">
                  {
                                cr.tasks.map((e,i,a)=>{
                                  return(
                                    <div className="task" onClick={()=>this.taskEdit(e.id, e.name, e.description)}>
                                      <div className="task-name">{e.name}</div>
                                      <div className="task-description">{e.description}</div>
                                      <div className="task-id">{e.id}</div>
                                    </div>
                                  )
                                })
                  }
                </div>
                </div>
                
              </div>
            )
          })
        }
      </div></div>
      <div className="nBoardL">
      <div className="nHeader">Чат {this.state.taskEdit.name}</div>
      <div className="nBoard-container">
      <div className="nBoard-inner">
        {this.state.taskEdit.id ? (<Appср />) : ("Выберите задачу")}
      </div>
      </div>
      </div>
      <div className="nBoardR">
                <div className="nBoard-container">
                <div className="nBoard-inner">
                  <div className="users-list">
                  <div className="nHeader">Выберите пользователя</div>
                    {
                      
                    }
                  </div>
                  </div>
                </div>
                  <div className="nHeader">Редактировать</div>
                  <div className="nBoard-container">
                  <div className="nBoard-inner">
                    <div><input type="text" name="0" value={this.state.input} placeholder="Наименование" /></div>
                    <div><input type="text" name="0" value={this.state.input} placeholder="Описание" /></div>
                    <div className="state">
                      {
                        
                      }
                    </div>
                    <div><input type="text" name="0" value={this.state.input} placeholder="State" /></div>
                  </div>
                  </div>
      </div>

      </div>
    );
  }
}


Column.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  full: PropTypes.object,
};