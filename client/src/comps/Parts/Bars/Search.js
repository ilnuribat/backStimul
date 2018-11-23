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
          }
          tasks{
            id
            name
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
                              <div className="SearchTask"  key={e.id}>
                                <div className="SearchTaskTop"  key={e.id}>
                                  {e.name ? <span className="SearchName">{e.name}</span> : null}
                                  {e.endDate ? <span className="SearchEndDate" >{ moment(e.endDate).format('D MMM, h:mm')}</span> : null}
                                  {e.endDate ? <span className="SearchEndDate" >{ moment(e.endDate).hours()}</span> : null}
                                  {/* {e.endDate ? <span className="SearchEndDate" >{ moment(e.endDate).unix()}</span> : null} */}
                                  {/* {e.endDate ? <span className="SearchEndDate" >{ moment().unix()}</span> : null} */}
                                  {/* {e.endDate ? <span className="SearchEndDate" >{ moment().unix() - moment(e.endDate).unix()}</span> : null} */}
                                  {/* {e.endDate ? <span className="SearchEndDate" >{ moment(e.endDate).unix() - moment().unix() }</span> : null} */}
                                  {/* {e.endDate ? <span className="SearchEndDate" >{ moment(moment(e.endDate).unix() - moment().unix()).hours() }</span> : null} */}
                                  {/* {e.endDate ? <span className="SearchEndDate" >{ moment(moment().unix() - moment(e.endDate).unix()).hours() }</span> : null} */}
                                  {e.endDate ? <span className="SearchEndDate" >{ moment().format('D MMM, h:mm') }</span> : null}
                                  {e.endDate ? <span className="SearchEndDate" >{ moment(e.endDate).format('D MMM, h:mm').diff(moment().format('D MMM, h:mm')) }</span> : null}

                                  <span className="SearchStatus">{ e.status ? e.status : "Новая" }</span>
                                </div>
                                {e.assignedTo ? <UserRow view="Boxed" id={e.assignedTo.id} icon="1" name={e.assignedTo.username} key={e.assignedTo.id} /> : null}
                              </div>
                            )) }</div>:  null
                          }
                          { Search.objects ? <h3 className="BlockHeader">Объекты</h3> : null}
                          { Search.objects ? <div className="BlockContent">{
                            Search.objects.map((e)=>(
                              <div className="SearchObjects"  key={e.id}>{e.name}</div>
                            )) }</div>:  null
                          }
                          { Search.users ? <h3 className="BlockHeader">Пользователи</h3> : null}
                          { Search.users ? <div className="BlockContent">{
                            Search.users.map((e)=>(
                              <UserRow view="Boxed" id={e.id} icon="1" name={e.username} key={e.id} />
                            )) }</div>:  null
                          }
                          { Search.messages ? <h3 className="BlockHeader">Сообщения</h3> : null}
                          { Search.messages ? <div className="BlockContent">{
                            Search.messages.map((e)=>(
                              <div className="SearchMessage" key={e.id}>{e.text}</div>
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
