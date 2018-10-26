import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Fire, Favor, Private, Tasks } from './Bar';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {cache} from '../index';
import { setActUrl, getActUrl  } from '../graph/querys';
import { graphql, compose } from "react-apollo";

class LeftBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }
  }

  hidePanel = () => {


  }

  componentDidMount(){
    if(!this.props.Active.ActUrl){
      this.props.setActive({
        variables:{
          ActUrl: 'root',
        }
      })
    }
  }

  componentDidUpdate(){
    // let {Active} = this.props;
    // if(Active && Active.ActUrl === 'private' || Active && Active.ActUrl === 'root'){
    //   console.log(Active)
    //   this.setState({
    //     isHidden: false,
    //   })
    //   // Active.ActUrl
    // }
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
    if(!!this.props.Active.ActUrl && this.props.Active.ActUrl === 'root'){
        return(
          <div className="left-bar">
            {
              this.switcher()
            }
          </div>
        )
    }else{
      return true;
    }
  }
}

LeftBar.propTypes = {
  barstate: PropTypes.string.isRequired
};


export default compose(
  graphql(getActUrl, { name: 'Active' }),
  graphql(setActUrl, { name: 'setActive' }),
)(LeftBar);