import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo';
import PropTypes from 'prop-types'
import { gBar } from '../../../GraphQL/Cache';
import { Search } from './Search';


export class BarInner extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  

  static propTypes = {

  }

  render() {
    let { children, gBar } = this.props;

    console.log("gBar-----------")
    console.log(this.props.gBar)

    if(gBar && gBar.barType){


      switch (gBar.barType) {
      case 'Search' || 'search':
        return(
          <Search></Search>
        );
      
      default:
        return(
          <Search></Search>
        );
      }
    }else{
      return(
        <Search></Search>
      );
    }


  }
}


export default compose(
  graphql(gBar, { name: 'gBar' }),
)(BarInner)
