import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from "react-apollo";
import { setActUrl, getActUrl } from '../../graph/querys';

class Map extends React.Component {
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
      <div className={ Active.ActUrl && Active.ActUrl == 'map' ? "nav-button active" : "nav-button" } name="map" onClick={()=>this.setActUrl('map')}>
        <Link
          className="link dim black b f6 f5-ns dib mr3"
          to="/map"
          title="map"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
          </svg>
        </Link>
      </div>
    )
  }
}
export default compose(
  graphql(getActUrl, { name: 'Active' }),
  graphql(setActUrl, { name: 'setActive' }),
)(Map);



