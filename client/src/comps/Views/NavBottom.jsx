import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { graphql, compose } from "react-apollo";
// import NavTopInner from './NavTopInner';
// import Logo from './Logo.jpg'
import logoImg from '../Img/Logo';
import { qauf, _url } from '../../constants';
import { ALL_MESSAGE_CREATED } from '../../GraphQL/Qur/Subscr';
import { lastMessageCache, getlastMessageCache, cGetCountPrivates, cSetCountPrivates, messagesListCacheUpdate, privateListCacheUpdate } from '../../GraphQL/Cache';
import { getUnreadCount } from '../../GraphQL/Qur/Query';
import { UserRow } from '../Parts/Rows/Rows';

class NavBottom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunOnce: false,
      theme: '',
    }

    this.changeTheme = this.changeTheme.bind(this)
  }

    componentDidMount (){
      if(localStorage.getItem('theme') === 'white'){
        this.setState({
          theme: ' white',
        })
      }
    }

    changeTheme(){
      if(localStorage.getItem('theme') === 'white'){
        localStorage.setItem('theme', '')
        this.setState({
          theme: '',
        });
      }else{
        localStorage.setItem('theme', 'white')
        this.setState({
          theme: ' white',
        })
      }
    }

    render() {
      let style; 
      if(this.state.theme === ' white'){
        style = require('../../newcss/white.css')
      }else{
        style = "";
      }

      return (
        <div className = "NavBottom" >
          <div className={"ColorButton" + this.state.theme } onClick={this.changeTheme}></div>
        </div>
      )
    }
}


NavBottom.propTypes = {
  cGetCountPrivates: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default compose(
  graphql(cGetCountPrivates, { name: 'cGetCountPrivates' }),
)(NavBottom);
