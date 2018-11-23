import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { gBar } from '../../../GraphQL/Cache/index';
// import { compose, graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../../Loading';
import { checkServerIdentity } from 'tls';

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
            name
          }
          tasks{
            name
          }
          users{
            username
          }
          messages{
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


                      if(Search){
                        for(let prop in Search) {
                          console.log("Search." + prop + " = " + Search[prop]);
                          switch (prop) {
                          case "tasks":

                            break;

                          case "objects":

                            break;

                          case "users":

                            break;

                          case "messages":

                            break;

                          default:
                            break;
                          }
                        }
                      }

                      return(
                        <div id="">
                          { Search.messages ? <p>Сообщения</p> : null}
                          { Search.messages ?
                            Search.messages.map((e)=>(
                              <li key={e.id}>{e.text}</li>
                            )) :  null
                          }
                          { Search.tasks ? <p>Задачи</p> : null}
                          { Search.tasks ?
                            Search.tasks.map((e)=>(
                              <li key={e.id}>{e.name}</li>
                            )) :  null
                          }
                          { Search.objects ? <p>Объекты</p> : null}
                          { Search.objects ?
                            Search.objects.map((e)=>(
                              <li key={e.id}>{e.name}</li>
                            )) :  null
                          }
                          { Search.tasks ? <p>Пользователи</p> : null}
                          { Search.tasks ?
                            Search.tasks.map((e)=>(
                              <li key={e.id}>{e.username}</li>
                            )) :  null
                          }
                        </div>
                      )
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
