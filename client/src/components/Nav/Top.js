import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from "react-apollo";
import PropTypes from 'prop-types';
import { setActUrl, getActUrl  } from '../../graph/querys';

class Top extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }

    this.barstate = this.barstate.bind(this);

  }

  barstate(){

  }

  setActUrl(e){
    this.props.setActive({
      variables: {
        ActUrl: e,
      }
    });
  }


render(){
    const { Active } = this.props;
    let type = 'Top';

    return(
      <div className={ Active.ActUrl && Active.ActUrl == type ? "nav-button active" : "nav-button" } name={type} onClick={()=>{this.setActUrl(type);  }}>
        <Link
          className="link dim black b f6 f5-ns dib mr3"
          to={`/${type}`}
          title={type}
        >

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        </Link>

      </div>
    )
  }
}

Top.propTypes = {
  // getCountPriv: PropTypes.shape({
  //   unr: PropTypes.number
  // }).isRequired,
};

export default compose(
  graphql(getActUrl, { name: 'Active' }),
  graphql(setActUrl, { name: 'setActive' }),
)(Top);
