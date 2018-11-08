import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from "react-apollo";
import { setActUrl, getActUrl } from '../../graph/querys';

class Edit extends React.Component {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path clipRule="evenodd" fill="none" d="M0 0h24v24H0z"/>
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      </div>
    )
  }
}
export default compose(
  graphql(getActUrl, { name: 'Active' }),
  graphql(setActUrl, { name: 'setActive' }),
)(Edit);
