import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { gBar } from '../../../GraphQL/Cache/index';
// import { compose, graphql } from 'react-apollo';
import { Mutation } from 'react-apollo';
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
    this.setState({value: event.target.value.toUpperCase()});
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

    let Search = gql `
    mutation search($string: String){
      search(string: $string ){
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
          <Mutation mutation={Search} variables={value}>
            {
              ({data, loading, error})=>{
                if(error) return error.message
                if(loading) return "загрузка"

                if(data){
                  console.log(data)
                  return "data"
                }
              }
            }
          </Mutation>
        </div>
        {children}
      </div>
    )
  }
}


export default Search;
