import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import NavTopInner from './NavTopInner';
// import Logo from './Logo.jpg'
import logoImg from '../Img/Logo';


export default class NavTop extends Component {
  static propTypes = {
  }

  render() {
    let {children, name, img, url} = this.props;

    if(!img){
      img = logoImg;
    }

    return (
      <div className="NavTop">
        <div className="LogoNav">
          <Link to="/login">
            <img src={img} alt={name||""}/>
          </Link>
        </div>
        {/* <NavTopInner/> */}
        {localStorage.getItem('username')}
        {children}

      </div>
    )
  }
}
