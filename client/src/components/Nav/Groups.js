import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from "react-apollo";
import { setActUrl, getActUrl } from '../../graph/querys';

class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }
  }

  setActUrl(e){
    this.props.setActive({
      variables: {
        ActUrl: e,
      }
    });
  }


  render(){
    let { Active } = this.props;

    return(
      <div className={ Active.ActUrl && Active.ActUrl == 'root' ? "nav-button active" : "nav-button" } name="root" onClick={()=>this.setActUrl('root')}>
        <Link
          className="link dim black b f6 f5-ns dib mr3"
          to="/"
          title="Root"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </Link>
      </div>
    )
  }
}
export default compose(
  graphql(getActUrl, { name: 'Active' }),
  graphql(setActUrl, { name: 'setActive' }),
)(Groups);
