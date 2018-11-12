import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';

const NavArr = [
  {name:"1", link:"1", comp:"", svg:"search"},
  {name:"2", link:"2", comp:"", svg:"svg2"},
  {name:"3", link:"3", comp:"", svg:"svg3"},
  {name:"4", link:"4", comp:"", svg:"svg1"},
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
