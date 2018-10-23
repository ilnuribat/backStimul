import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Fire, Favor, Private, Tasks } from './Bar';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {cache} from '../index'

class LeftBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }
  }

  hidePanel = () => {


  }

  switcher(){
    const { barstate } = this.props

    switch (barstate) {

    case "chat":
      return (
        <Tasks />
      )
    case "test":
      return (
        <Tasks />
      )
    case "fire":
      return <Fire />;
    case "favor":
      return <Favor />
    case "private":
      return <Private />
    default:
      return ( null )
    }
  }

  render() {

    const cache2 = new InMemoryCache();

    console.log("cache")
    console.log(cache)
    console.log(cache2)

    return(
      <div className="left-bar">
        {
          this.switcher()
        }
      </div>
    )

  }
}

LeftBar.propTypes = {
  barstate: PropTypes.string.isRequired
};

export default LeftBar
