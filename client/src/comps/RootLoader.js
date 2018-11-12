import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router';
import { getPrivateChat } from '../GraphQL/Qur/Query';
import { setPrivateChat } from '../GraphQL/Qur/Mutation';
import { getPlace } from '../GraphQL/Qur/Query';
import { setPlace } from '../GraphQL/Cache';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';


/** RootLoader */

class RootLoader extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    let placeType = this.props.getPlace.place.type;
    let urlsArr = ['map', 'tile', 'top','board','login','profile','private', 'task'];

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
          <Redirect to='/tile'/>
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
)(RootLoader);