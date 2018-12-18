import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router';
import { graphql, compose } from 'react-apollo';
import { setPlace, setChat, getChat, getPlace } from '../GraphQL/Cache';

/** RootLoader */

class RootLoader extends Component {
  static propTypes = {
  }

  render() {
    const { location } = this.props;

    const placeType = this.props.getPlace.place.type;
    const urlsArr = ['map', 'tile', 'top','board','login','profile','private', 'task'];

    const cis = urlsArr.indexOf(placeType);
    let rootState = ""

    switch (placeType){
    case "map":
      return(
        <Redirect to="/map"/>
      )
    case placeType && cis >= 0:
      return(
        <Redirect to={`/${placeType}`}/>
      )
    default:
      if (location && location.state && location.state.rootId) rootState = location.state.rootId

      return (
        <Redirect to={{
          pathname: '/tile',
          state: { rootState }
        }}/>
      )
    }
  }
}


RootLoader.propTypes = {
  setPlace: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
  getChat: PropTypes.object.isRequired,
  getPlace: PropTypes.object.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object
  }),
};



export default compose(
  graphql(getChat, { name: 'getChat' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(getPlace, { name: 'getPlace' }),
  graphql(setPlace, { name: 'setPlace' }),
)(RootLoader);
