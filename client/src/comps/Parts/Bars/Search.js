import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { gBar } from '../../../GraphQL/Cache/index';
// import { compose, graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../../Loading';
import { checkServerIdentity } from 'tls';
import {UserRow} from '../../Parts/Rows/Rows';
import moment from 'moment';
import { Link } from 'react-router-dom';


export class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chAll: true,
      chObj: false,
      chDcs: false,
      chMsg: false,
      chUsr: false,
      chTsk: false,
      chTskNew: false,
      chTskWrk: false,
      chTskChk: false,
      chTskEnd: false,
      value:'',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    target.type === 'checkbox' && target.name !== 'chAll' ? this.setState({chAll: false, [name]: value }) : this.setState({[name]: value});
    
    !this.state.chObj && !this.state.chTsk && !this.state.chDcs && !this.state.chUsr && !this.state.chMsg ? this.setState({chAll: true,}) : null
  }

  static propTypes = {

  }

  componentWillUpdate(){
    // !this.state.chObj && 
    // !this.state.chTsk && 
    // !this.state.chDcs && 
    // !this.state.chUsr && 
    // !this.state.chMsg ? this.setState({chAll: true,}) : null
  }

  // shouldComponentUpdate(nextProps, nextState){
    // if(nextState.chAll === this.state.chAll){
    //   return false
    // }
    // if(nextState === this.state){
    //   return false
    // }
    // return true
  // }

  render() {

    let Obj = `objects{
      id
      name
      address{
        value
      }
    }`;
    let Tsk = `tasks{
      id
      name
      objectId
      assignedTo{
        id
        username
      }
      endDate
      status
    }`;
    let Usr = `users{
      id
      username
    }`
    let Msg = `messages{
      id
      text
    }`;
    let Dcs = `docs{
      id
      name
    }`;

    let {children} = this.props;
    let {value} = this.state;
    // let query = value;
    let SearchGql = `
    query search($query: String!){
      search(query: $query){
        ${this.state.chAll || this.state.chObj ? Obj : null}
        ${this.state.chAll || this.state.chTsk ? Tsk : null}
        ${this.state.chAll || this.state.chUsr ? Usr : null}
        ${this.state.chAll || this.state.chMsg ? Msg : null}
        ${this.state.chAll || this.state.chDcs ? Dcs : null}
      }
    }
    `;

    let Search = gql(SearchGql);
    let checks = [
      {name: 'chAll', text:'Все', id:'0', some:'data'},
      {name: 'chObj', text:'Объекты', id:'0', some:'data'},
      {name: 'chTsk', text:'Задачи', id:'0', some:'data'},
      {name: 'chUsr', text:'Сотрудники', id:'0', some:'data'},
      {name: 'chMsg', text:'Сообщения', id:'0', some:'data'},
      {name: 'chDcs', text:'Документы', id:'0', some:'data'},
    ];
    let checksTasks = [
      {name: 'chTskNew', text:'Новые', id:'0', status:'1'},
      {name: 'chTskWrk', text:'В работе', id:'0', status:'3'},
      {name: 'chTskChk', text:'Проверяются', id:'0', status:'4'},
      {name: 'chTskEnd', text:'Завершенные', id:'0', status:'5'},
    ];
    let statuses = [
      {name: 'Новая', status:'1'},
      {name: 'В работе', status:'3'},
      {name: 'Проверяется', status:'4'},
      {name: 'Завершена', status:'5'},
    ];



    return(
      <div className="Search">
        <div className="SearchTop">
          <form onSubmit={this.handleSubmit}>
            <label className="LabelInputText" htmlFor="searchinput">
              <input type="text" name="searchinput" value={value} onChange={this.handleChange} placeholder="Найти задачи, человека, объект..."/>
            </label>


            <div className="searchTags">
              <div className="searchTagsRow">
                {
                  checks.map((e,i)=>{
                    return(
                      <label className={this.state[e.name] ? "searchTag sel" : "searchTag"} htmlFor={e.name} key={"check"+i}>
                        <input id={e.name} name={e.name} type="checkbox" checked={this.state[e.name]} onChange={this.handleInputChange} />
                        <span className="searchTagText">{e.text}</span>
                      </label>
                    )
                  })
                }

              </div>
              <div className="searchTagsRow">
                {
                  this.state.chTsk ? checksTasks.map((e,i)=>{
                    return(
                      <label className={this.state[e.name] ? "searchTag sel" : "searchTag"} htmlFor={e.name} key={"checkTsk"+i}>
                        <input id={e.name} name={e.name} type="checkbox" checked={this.state[e.name]} onChange={this.handleInputChange} />
                        <span className="searchTagText">{e.text}</span>
                      </label>
                    )
                  }) : null
                }
              </div>

            </div>
          </form>

        </div>
        <div className="SearchBody">
          {
            value ? (
              <Query query={Search} variables={{query: value}}>
                {
                  ({data, loading, error})=>{
                    if(error) {
                      console.log(error)

                      return error.message;
                    }
                    if(loading) return "загрузка"
                    if(data && data.previewSearch){
                      let Search={};

                      data.previewSearch.messages && data.previewSearch.messages.length > 0 ? Search.messages = data.previewSearch.messages : null
                      data.previewSearch.tasks && data.previewSearch.tasks.length > 0 ? Search.tasks = data.previewSearch.tasks : null
                      data.previewSearch.objects && data.previewSearch.objects.length > 0 ? Search.objects = data.previewSearch.objects : null
                      data.previewSearch.users && data.previewSearch.users.length > 0 ? Search.users = data.previewSearch.users : null

                      // Search ? console.log("Search", Search) : null
                      
                      // Search ? (
                      return(
                        <div id="SeacrhInner">
                          { Search.tasks ? <h3 className="BlockHeader">Задачи</h3> : null}
                          { Search.tasks ? <div className="BlockContent">{
                            Search.tasks.map((e)=>(
                              <Link key={e.id} to={{pathname: "/task", state:{taskId: e.id, taskName: e.name, objectId: e.objectId || '1' }}} >
                                <div className="SearchTask"  key={e.id}>
                                  <div className="SearchTaskTop"  key={e.id}>
                                    {e.name ? <span className="SearchName">{e.name}</span> : null}
                                    {e.endDate ? <span className={moment(e.endDate).fromNow() ? "SearchEndDate" : "SearchEndDate" } >{ moment(e.endDate).format('D MMM, h:mm')}</span> : null}
                                    {
                                      // (()=>{
                                      //   if(e.status){
                                      //     let a = statuses.find((x)=>x.status == e.status).name;
                                      //     return a

                                      //   } 
                                      // })()
                                    }
                                  
                                    <span className="SearchStatus">{ e.status ? statuses.find((x)=>x.status == e.status).name : "Новая" }</span>
                                  </div>
                                  {e.assignedTo ? <UserRow view="Boxed" id={e.assignedTo.id} icon="1" name={e.assignedTo.username} key={e.assignedTo.id} /> : null}
                                </div>
                              </Link>
                            )) }</div>:  null
                          }
                          { Search.objects ? <h3 className="BlockHeader">Объекты</h3> : null}
                          { Search.objects ? <div className="BlockContent">{
                            Search.objects.map((e)=>(
                              <Link key={e.id} to={{pathname: "/board", state:{objectId: e.id }}} >
                                <div className="SearchObjects"  key={e.id}>
                                  <span className="SearchName">{e.name} </span>{e.address && e.address.value ? <span className="SearchStatus">{e.address.value}</span> : null}                           
                                </div>
                              </Link>
                            )) }</div>:  null
                          }
                          { Search.users ? <h3 className="BlockHeader">Пользователи</h3> : null}
                          { Search.users ? <div className="BlockContent">{
                            Search.users.map((e)=>(
                              <Link key={e.id} to={{pathname: "/profile", state:"id"}} >
                                <UserRow view="Boxed" id={e.id} icon="1" name={e.username} key={e.id} />
                              </Link>
                            )) }</div>:  null
                          }
                          { Search.messages ? <h3 className="BlockHeader">Сообщения</h3> : null}
                          { Search.messages ? <div className="BlockContent">{
                            Search.messages.map((e)=>(
                              <Link key={e.id} to={{pathname: "/profile", state:"id"}} >
                                <div className="SearchMessage" key={e.id}>{e.text}</div>
                              </Link>
                            )) }</div>:  null
                          }


                        </div>
                      )
                      // ) : ("Нет данных")
                    }

                    return(
                      "ничего не найдено"
                    )

                  }
                }
              </Query>
            ) : ("Введите название, адрес, Имя, документ, шифр")
          }

        </div>
        {children}
      </div>
    )
  }
}


export default Search;
