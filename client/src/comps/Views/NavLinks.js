import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';

const NavArr = [
  {name:"search", link:"", comp:"", svg:"search"},
  {name:"private", link:"/chat", comp:"", svg:"private"},
  {name:"3", link:"", comp:"", svg:"svg3"},
  {name:"map", link:"/map", comp:"", svg:"location"},
];

export default class NavLinks extends Component {
  static propTypes = {
  }

  render() {
    let {children} = this.props;

    return (
      <div className="NavLinks">
        {children}
        {
          NavArr.map((e,i)=>{
            return(
              <div className="nav">
                <Link to={e.link}>
                  <Svg svg={e.svg} />
                </Link>
              </div>
            )
          })
        }
      </div>
    )
  }
}
