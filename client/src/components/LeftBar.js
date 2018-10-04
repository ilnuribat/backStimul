import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Fire, Favor, Private, Tasks } from './Bar';

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
    return(
      <div className="left-bar">
        {
          this.switcher()
        }
      </div>
    )



    // if(this.props.lstate){
    //   return (
    //   <div className="left-bar">
    //       <Appср/>
    //   </div>
    //   )
    // }else{
    //   return true;
    // }

  }
}

LeftBar.propTypes = {
  barstate: PropTypes.string.isRequired
};

export default LeftBar
