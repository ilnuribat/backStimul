import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from "react-apollo";
import PropTypes from 'prop-types';
import { cGetCountPrivates } from '../../graph/querys';

class Private extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }

    this.barstate = this.barstate.bind(this);

  }

  barstate(){

  }

  render(){

    const { getCountPriv } = this.props;

    // console.warn (getCountPriv.unr)

    return(
      <div className="nav-button" name="private">
        <Link
          className="link dim black b f6 f5-ns dib mr3"
          to="/private"
          title="private"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15-1.17 2.97-4.06 5.09-7.45 5.09z"/><path fill="none" d="M0 0h24v24H0z"/>
          </svg>
        </Link>
        {getCountPriv && getCountPriv.unr ? (<div className="indic g">{getCountPriv.unr }</div>) : null}

      </div>
    )
  }
}

Private.propTypes = {
  getCountPriv: PropTypes.shape({
    unr: PropTypes.number
  }).isRequired,
};

export default compose(
  graphql(cGetCountPrivates, { name: 'getCountPriv' }),
)(Private);
