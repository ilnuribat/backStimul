import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router';
import { graphql, compose } from 'react-apollo';
import { setPlace, setChat, getChat, getPlace } from '../GraphQL/Cache';



/** RootLoader */

class RootLoader extends Component {
  static propTypes = {
  }

  render() {
    const {children, location} = this.props;

    const placeType = this.props.getPlace.place.type;
    const urlsArr = ['map', 'tile', 'top','board','login','profile','private', 'task'];

    const cis = urlsArr.indexOf(placeType);
    let rootState = ""

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
      location && location.state && location.state.rootId ? rootState = location.state.rootId : null

      return (
        <Redirect to={{
          pathname: '/tile',
          state: { rootState }
        }}/>
      )
      break;
    }
  }
}


export default compose(
  graphql(getChat, { name: 'getChat' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(getPlace, { name: 'getPlace' }),
  graphql(setPlace, { name: 'setPlace' }),
)(RootLoader);
