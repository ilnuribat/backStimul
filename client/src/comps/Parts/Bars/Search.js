import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { gBar } from '../../../GraphQL/Cache/index';
// import { compose, graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../../Loading';

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



    let SearchGql = `
    query search($query: String){
      search(query: $query ){
        Objects{
          name
        }
        Tasks{
          name
        }
        Users{
          name
        }
        Chats{
          name
        }
        Docs{
          name
        }
      }
    }
    `;

    SearchGql = `
    query search($text: String){
      search(text: $text ){
        __typename
        ... on Object{
          name
        }
      }
    }
    `;
    let Search = gql`
      ${SearchGql}
  `;

    return(
      <div className="Search">
        <div className="SearchTop">
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text"  value={value} onChange={this.handleChange} placeholder="Найти задачи, человека, объект..."/>
            </label>
          </form>
          
        </div>
        <div className="SearchBody">
          {
            value ? (
              <Query query={Search} variables={{value}}>
                {
                  ({data, loading, error})=>{
                    if(error) {
                      console.log(error)
                      return error.message}
                    if(loading) return "загрузка"
                    
                    console.log(error)
                    console.log(data)

                    if(data){
                      let ObjectTypes;
                      console.log(data)
                      data.map((e,i)=>{

                        switch (e.__typename) {
                        case 'User':
                          ObjectTypes = 'Сотрудники';
                          break;
                        case 'Task':
                          ObjectTypes = 'Задачи';
                          break;
                        case 'Object':
                          ObjectTypes = 'Объекты';
                          break;
                        case 'Message':
                          ObjectTypes = 'Сообщения';
                          break;
                        
                        default:
                          break;
                        }


                        return(
                          <div>
                            {e.__typename}
                          </div>
                        )
                      })
                      return "data"
                    }
                    // if(data.Objects){
                    //   return(
                    //     <div>
                    //       <div>Объекты</div>
                    //       <div>{}</div>
                    //     </div>
                    //   )
                    // }
                    // if(data.Tasks){
                    //   return(
                    //     <div>
                    //       <div>Задачи</div>
                    //       <div>{}</div>
                    //     </div>
                    //   )
                    // }
                    // if(data.Users){
                    //   return(
                    //     <div>
                    //       <div>Пользователи</div>
                    //       <div>{}</div>
                    //     </div>
                    //   )
                    // }
                    // if(data.Chats){
                    //   return(
                    //     <div>
                    //       <div>Чаты</div>
                    //       <div>{}</div>
                    //     </div>
                    //   )
                    // }
                    // if(data.Docs){
                    //   return(
                    //     <div>
                    //       <div>Документы</div>
                    //       <div>{}</div>
                    //     </div>
                    //   )
                    // }
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
