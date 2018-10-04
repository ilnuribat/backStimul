import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo';
import { PropTypes } from 'prop-types';
// import gql from 'graphql-tag';
// import io from 'socket.io-client'
import { changeGroup, showCurrentGroup, createGroup, user } from '../../graph/querys';
// import { _api, quf, qauf, _url } from '../../constants'
import { qauf, _url } from '../../constants'
import 'animate.css';

class Tasks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // groupList: [
      //   {id:"1",name:"Группа 1"},
      //   {id:"2",name:"Группа 2"},
      //   {id:"3",name:"Группа 3"},
      //   {id:"4",name:"Группа 4"},
      //   {id:"5",name:"Группа 5"},
      // ],
      grl: [],
      grid: '',
      addGroupInputs: false,
      // input: [],
      newGrName: '',
    }

    this.changeGroup = this.changeGroup.bind(this);
    this.AddGroupInputs = this.AddGroupInputs.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.CreateGroup = this.CreateGroup.bind(this);
    this.fetcher = this.fetcher.bind(this);

  }

  componentDidMount(){
    this.fetcher()

  }

  changeGroup = (i,n) => {
    const {changeGroup} = this.props

    localStorage.setItem('grid',i);
    localStorage.setItem('grnm',n);
    this.setState({
      grid: i,
      // grnm: n,
    })
    changeGroup ({
      variables: { currentGroup: i, groupName: n }
    })
  }

  changeGroup2(e,n){
    const {chgr} = this.props

    localStorage.setItem('grid',e);
    localStorage.setItem('grnm',n);
    this.setState({
      grid: e,
      // grnm: n,
    })
    chgr();
  }


  fetcher(){
    qauf(user(localStorage.getItem('userid')), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data.user.groups){
        this.changeState(a.data.user.groups);
      }
    }).catch((e)=>{
      console.warn(e);
    });
  }

  AddGroupInputs(){
    this.setState({
      addGroupInputs: true,
    })
  }

  inputChange(e){
    let val = e.target.value;

    let input = [];

    input.push(val);

    this.setState({
      newGrName: val,
    })
  }

  CreateGroup(){
    this.setState({
      addGroupInputs: false,
    })
    const { newGrName } = this.state;
    let params = `{name:"${newGrName}"}`;
    qauf(createGroup(params), _url, localStorage.getItem('auth-token')).then(a=>{
      if(a && a.data){
        this.fetcher()
      }
    }).catch((e)=>{
      console.warn(e);
    });

  }

  changeState(a){
    this.setState({
      grl: [...a],
    })
  }

  render() {

    const {grl, grid, addGroupInputs, newGrName} = this.state;
    const { showCurrentGroup } = this.props;

    return (
      <div>
        <h3>Задачи</h3>
        <div className='list-container'>

          {grl.map((e,i)=>{
            return(
              <div key={"gr"+i} role="presentation" className={grid === e.id || showCurrentGroup.currentGroup === e.id ? 'active list animated fadeIn' : 'list animated fadeIn'} onClick={()=>{this.changeGroup(e.id, e.name)}}>{e.name}</div>
            )
          }) }
          {
            addGroupInputs?(
              <div className="list animated fadeInLeft" style={{textAlign: "center"}}>
                <h3>Создание новой группы</h3>
                <input type="text" value={newGrName} onChange={this.inputChange} placeholder="Название группы" />
                <input type="submit" value="Создать" onClick={this.CreateGroup} />
              </div>
            ):(
              <div className="list animated fadeIn" role="presentation" style={{textAlign: "center"}} onClick={this.AddGroupInputs}>Добавить новую</div>
            )
          }
        </div>
      </div>
    )
  }
}

Tasks.propTypes = {
  showCurrentGroup: PropTypes.shape({
    currentGroup: PropTypes.string
  }).isRequired,
  changeGroup: PropTypes.func.isRequired,
  chgr: PropTypes.func,
};

Tasks.defaultProps = {
  chgr: f => f
};

export default compose(
  graphql(changeGroup, { name: 'changeGroup' }),
  graphql(showCurrentGroup, { name: 'showCurrentGroup' }),
)(Tasks);
