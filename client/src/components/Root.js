import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { graphql, compose } from "react-apollo";
import { getPrivateChat, setPrivateChat, setPlace, getPlace } from '../graph/querys';
const {Redirect} = require('react-router');

class Root extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       __back:'',
       __url: '',
    }
  }

  componentDidMount(){
    let back = localStorage.getItem('back');
    if(back){
      this.props.setPlace({
        variables:{
          id: back,
          type:'top',
        }
      })
    }
  }
  componentDidUpdate(){

  }
  

  backToTheFuture(){

  }

  static propTypes = {
  }

  render() {
    
    let placeType = this.props.getPlace.place.type;
    let urlsArr = ['map','top','board','login','profile','private', 'task'];

    let cis = urlsArr.indexOf(placeType);

    switch (placeType){
      case "map":
          return(
            <Redirect to="/map"/>
          )
        break;

      case placeType && cis >= 0:
          return(
            <Redirect to={`/${placeType}`}/>
          )
        break;
    
      default:
          return(
          <Redirect to='/Top'/>
          )
        break;
    }

  }
}

export default compose(
  graphql(getPrivateChat, { name: 'getChat' }),
  graphql(setPrivateChat, { name: 'setChat' }),
  graphql(getPlace, { name: 'getPlace' }),
  graphql(setPlace, { name: 'setPlace' }),
)(Root);