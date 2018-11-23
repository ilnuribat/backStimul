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
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  static propTypes = {

  }

  render() {
    let {children} = this.props;
    let {value} = this.state;
    // let query = value;
    let SearchGql = `
    query previewSearch($query: String!){
        previewSearch(query: $query){
          objects{
            id
            name
            address{
              value
            }
          }
          tasks{
            id
            name
            #objectId
            assignedTo{
              id
              username
            }
            endDate
            status
          }
          users{
            id
            username
          }
          messages{
            id
            text
          }
      }
    }
    `;

    // SearchGql = `
    // query search($text: String){
    //   search(text: $text ){
    //     __typename
    //     ... on Object{
    //       name
    //     }
    //   }
    // }
    // `;

    let Search = gql(SearchGql);
    let checks = [
      {name: 'Все', id:'0', some:'data'},
      {name: 'Объекты', id:'0', some:'data'},
      {name: 'Задачи', id:'0', some:'data'},
      {name: 'Сотрудники', id:'0', some:'data'},
      {name: 'Сообщения', id:'0', some:'data'},
      {name: 'Документы', id:'0', some:'data'},
    ];
    let checksTasks = [
      {name: 'Новые', id:'0', status:'1'},
      {name: 'В работе', id:'0', status:'3'},
      {name: 'Проверяются', id:'0', status:'4'},
      {name: 'Завершенные', id:'0', status:'5'},
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
                      <label className={i === 0 ? "searchTag sel" : "searchTag"} htmlFor={"check"+i} key={"check"+i}>
                        <input type="checkbox" name={"check"+i}/>
                        <span className="searchTagText">{e.name}</span>
                      </label>
                    )
                  })
                }

              </div>
              <div className="searchTagsRow">
                {
                  true ? checksTasks.map((e,i)=>{
                    return(
                      <label className={i === 0 ? "searchTag sel" : "searchTag"} htmlFor={"check"+i} key={"check"+i}>
                        <input type="checkbox" name={"check"+i}/>
                        <span className="searchTagText">{e.name}</span>
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

                      Search ? console.log("Search", Search) : null

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
                                      //       console.log("sssssssssssssssssssss",a)
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
