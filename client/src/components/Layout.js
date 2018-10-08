import React,{Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import LeftBar from './LeftBar';

class FirstLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }
  }

  render(){
    const { children, barstate } = this.props

    return(
      <Fragment>
        {barstate ? (<LeftBar barstate={barstate} />) : null}
        <div className={barstate ? 'main-container' : 'main-container full'}>
          {children}
        </div>
      </Fragment>
    )
  }
}

FirstLayout.propTypes = {
  children: PropTypes.node.isRequired,
  barstate: PropTypes.string.isRequired,
};

export default FirstLayout;
