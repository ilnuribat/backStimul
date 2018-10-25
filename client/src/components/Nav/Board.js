import React from 'react';
import { Link } from 'react-router-dom';
import { setActUrl, getActUrl } from '../../graph/querys';
import { graphql, compose } from "react-apollo";

// const Board = ({Active, setActive},...props) =>{

class Board extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isHidden: true
      }
  
  
    }

render(){
  let {Active,setActive } = this.props;
  console.log("props")
  // console.log(props)
  console.log(Active)
  console.log(setActive)
  return(
    <div className={ Active.ActUrl && Active.ActUrl == 'aboard' ? "nav-button active" : "nav-button" } name="aboard">
      <Link
        className="link dim black b f6 f5-ns dib mr3"
        to="/aboard"
        title="aboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={()=>setActive('aboard')}>
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      </Link>
    </div>
  )
}

}


export default compose(
  graphql(setActUrl, { name: 'Active' }),
  graphql(getActUrl, { name: 'setActive' }),
)(Board);