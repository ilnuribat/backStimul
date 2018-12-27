import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TopBar.css'


export class TopBar extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  
  static propTypes = {

  }



  render() {
    const { last, center, left, right, bottom, children } = this.props;
    let lastInt = 0,
      centerInt = 0,
      leftInt = 0,
      rightInt = 0,
      bottomInt = 0,
      cenArr = [],
      leftArr = [],
      rightArr = [],
      botArr = []
      ;

    if (children && children.length > 0){
      leftArr = children[0];
      cenArr = children.length >= 2 && children[1] || null;
      rightArr = children.length >= 3 && children[2] || null;
      
      botArr = children.length >= 4 && children.slice(3) || null;
    }else{
      cenArr = children
    }


    return (
      <div className="TopBar">
        <div className="top">
          <div className="Left">
            {
              leftArr
            }
          </div>
          <div className="Center">
            {
              cenArr
            }
          </div>
          <div className="Right">
            {
              rightArr
            }
          </div>
        </div>
        <div className="bottom">
          {
            botArr
          }
        </div>
      </div>
    )
  }
}

export default TopBar
