import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo';
import { PropTypes } from 'prop-types';
import { setPrivateChat, getPrivateChat, createGroup, user, getCUser, glossaryStatus } from '../../graph/querys';
import { qauf, _url } from '../../constants';
import _ from 'lodash';
import 'animate.css';
import Loading from '../Loading';

class Tasks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grl: [],
      grid: '',
      addGroupInputs: false,
      newGrName: '',
      status: [],
    }

    this.changeGroup = this.changeGroup.bind(this);
    this.AddGroupInputs = this.AddGroupInputs.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.CreateGroup = this.CreateGroup.bind(this);
    this.fetcher = this.fetcher.bind(this);

  }

  componentDidMount(){
    this.glossStatus();
    this.fetcher();

  }

  changeGroup = (i,n) => {
    const {setPrivateChat} = this.props

    localStorage.setItem('grid',i);
    localStorage.setItem('grnm',n);
    this.setState({
      grid: i,
    })
    setPrivateChat ({
      variables: { id: i, name: n }
    })
  }

  changeGroup2(e,n){
    const {chgr} = this.props

    localStorage.setItem('grid',e);
    localStorage.setItem('grnm',n);
    this.setState({
      grid: e,
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

  glossStatus(){

    qauf(glossaryStatus(), _url, localStorage.getItem('auth-token')).then(a=>{
      this.setState({
        status: ["",...a.data.glossary.taskStatuses]
      });
      // console.log(a)
    })
      .catch((e)=>{
        console.warn(e);
      });
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
    const {grl, grid, addGroupInputs, newGrName, status} = this.state;
    const { getPrivateChat, getCUser } = this.props;

    let cols = [[],[],[],[],[],[],[]]; 

    if(getCUser.loading) return <Loading />;
    if(!getCUser.user) return <Loading />;
    if(!getCUser.user.groups) return <Loading />;

    let arr = getCUser.user.groups;

    arr = _.sortBy(arr, 'unreadCount');
  
    _.forEach(arr, (result)=>{
      if(!result.status){
        cols[1].push(result);
      }
      if(result.status){
        cols[result.status].push(result);
      }
    });

    // return(
    //   <div className="content-aft-nav columns-wrapper">
    //     {
    //       status.map((e,i)=>{
    //         if(!e.name){
    //           return true;
    //         }
    //         return <Column key={"column"+e.id} name={e.name} tasks={cols[i]} selectTask={this.selectTask} />
    //       })
    //     }
    //   </div>
    // )

    return (
      <div>
        <h3>Задачи</h3>
        <div className='list-container'>
          {
            status.map((e,i)=>{
              if(!e.name){
                return true;
              }

              return(
                <div className="colName">
                  <div className="colHead">{e.name}</div>

                  {cols[i].map((e,i)=>{
                      return(
                        <div key={"gr"+i} role="presentation" className={grid === e.id || getPrivateChat.id === e.id ? 'active list animated fadeIn' : 'list animated fadeIn'} onClick={()=>{this.changeGroup(e.id, e.name)}}>{e.name}</div>
                      )
                    })
                  }
                </div>
              )


            })
          }

                  {/* {arr.map((e,i)=>{
                      return(
                        <div key={"gr"+i} role="presentation" className={grid === e.id || getPrivateChat.id === e.id ? 'active list animated fadeIn' : 'list animated fadeIn'} onClick={()=>{this.changeGroup(e.id, e.name)}}>{e.name}</div>
                      )
                    })
                  } */}


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
  getPrivateChat: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  setPrivateChat: PropTypes.func.isRequired,
  chgr: PropTypes.func,
};

Tasks.defaultProps = {
  chgr: f => f
};

export default compose(
  graphql(setPrivateChat, { name: 'setPrivateChat' }),
  graphql(getPrivateChat, { name: 'getPrivateChat' }),
  graphql(getCUser, { name: 'getCUser' }),
)(Tasks);
