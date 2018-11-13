import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';

const NavArr = [
  {name:"search", link:"/", comp:"", svg:"search"},
  {name:"Root", link:"/", comp:"", svg:"tiles"},
  {name:"3", link:"", comp:"", svg:"svg3"},
  {name:"Private", link:"/chat", comp:"", svg:"private"},
  {name:"Pap", link:"/map", comp:"", svg:"location"},
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
              <div className="nav" key={"nav"+i+e.link}>
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
