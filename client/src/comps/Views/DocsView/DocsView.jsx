import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Content from '../../Lays/Content/index';

export class DocsView extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  
  static propTypes = {

  }

  render() {
    return (
      <Content>
        <div className="DocsView">
          DocsView
          <div className="DocsColumn">
            <div className="DocsColumnName"></div>
            <div className="DocsColumnContent"></div>
          </div>
        </div>
      </Content>
    )
  }
}

export default DocsView
