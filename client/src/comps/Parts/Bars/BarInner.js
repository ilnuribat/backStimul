import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { gBar } from '../../../GraphQL/Cache/index';
import { compose, graphql } from 'react-apollo';
import { Search } from './Search';


export class BarInner extends Component {
  static propTypes = {

  }

  render() {
    let {children, gBar} = this.props;

    if(gBar && gBar.barType){
      switch (gBar.barType) {
        case 'Search':
            return(
              <Search></Search>
            );
      
        default:
          return(
            <Search></Search>
          );
      }
    }else{
      return false;
    }


  }
}


export default compose(
  graphql(gBar, {name: 'gBar'})
)(BarInner)
