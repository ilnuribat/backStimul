import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { gBar } from '../../../GraphQL/Cache/index';
import { compose, graphql } from 'react-apollo';

export class Search extends Component {
  static propTypes = {

  }

  render() {
    let {children} = this.props;

    return(
      <div>
        SEARCH
      </div>
    )
  }
}


export default Search;
