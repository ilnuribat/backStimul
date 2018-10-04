import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { quf } from '../constants';
import { updTask, getPriority, getById, crTask } from '../graph/querys';
import TaskBlock from './nTask';



let filename = "file: Column";
let log = (fun, e) => {
  console.warn(filename, "func:", fun, e)
};

export default class Column extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // status: false,
      // key: 0,
      // opncr: false,
      open: false,
      input: [],
    };

    this._crTask = this._crTask.bind(this);
    this._opencr = this._opencr.bind(this);
    this._closecr = this._closecr.bind(this);
    this._input = this._input.bind(this);

  }

  componentWillMount() {
    const { id } = this.props;
    let q = getById(id);

    quf(q)
      .then((a) => {
        if (a.data) {
          this.setState({
            task: a.data.task,
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

  _crTask() {
    const {input} = this.state
    const {id, refetch} = this.props
    let name = input[0];
    let description = input[1];
    // let priority = this.state.input[3];
    // let createdBy = this.state.input[4];
    // name description columnId priority createdBy
    let inputNew = `name: "${name}", description: "${description}", columnId: ${id}, priority: ${1}, createdBy: ${1}`;
    let q = crTask(`input: {${inputNew}}`);

    quf(q)
      .then(() => {
      });
    refetch();
    this.setState({
      open: !this.open,
      input: [],
    })
  }

  _mutTask(id, input) {
    let q = updTask(id, `input: {${input}}`);

    quf(q)
      .then(() => {
      });
  }

  _input(e){
    const {input} = this.state
    let inp = input;
    let val = e.target.value;
    let num = Number(e.target.name);

    inp[num] = val;

    this.setState({
      input: inp,
    })
  }

  _opencr(){

    this.setState({
      open: !this.open,
    })
  }

  _closecr(){
    this.setState({
      open: !this.open,
    })
  }


  _qPriority() {
    quf(getPriority)
      .then((a) => {
        if (a.data) {
          // this.setState({
          //   priority: a.data.glossary.priorities
          // })

          return a.data.glossary.priorities;
        } else {
          return false;
        }
      })
      .catch((e) => {
        log("getPriority", e);
      });
  }




  // editName() {
  //   this.setState({
  //     editName: true,
  //   })
  // }

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
    const {id, name, title, full} = this.props
    const {open, input} = this.state

    return(
      <div className="column">
        <div className="column-name">{name ? name : title }</div>
        <div className="column-id">
        id:
          {' '}
          {id}
        </div>
        <div className="column-content">
          <div className="column-inner">
            {
              full.tasks.map((e,i,a)=>{
                return(
                  <TaskBlock key={"task-"+i} />
                )
              })
            }
          </div>
        </div>
        <div className="column-bottom">
          {
            open ? (
              <div className="create-row">
                <div><input type="text" name="0" placeholder="Название" value={input[0]} onChange={this._input} /></div>
                <div><input type="text" name="1" placeholder="" value={input[1]} onChange={this._input} /></div>
                <div className="open" role="presentation" onClick={this._crTask}>Создать задачу</div>
                <div className="open" role="presentation" onClick={this._closecr}>отменить</div>
              </div>
            ) : (<div className="open" role="presentation" onClick={this._opencr}>Добавить задачу</div>)
          }

        </div>


        <svg className="add-fav hov" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
          <path fill="none" d="M0 0h18v18H0z" />
        </svg>
        <div className="open del hov">удалить</div>
      </div>
    );
  }
}


Column.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  full: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};
