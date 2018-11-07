import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql, compose } from "react-apollo";
import { TASKS_QUERY, getPrivateChat, setPrivateChat, glossaryStatus, getCUser, setTemp, getTemp, getPlace, setPlace } from '../graph/querys';
import { SvgBackTo } from './Svg';
import { savePlace } from '../constants';

class BtnBack extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      toTop: false,
       __back:'',
       __url: '',
    }
  }

  componentDidMount(){
    // let back = localStorage.getItem('back');
    // let url = localStorage.getItem('backurl');

    // if(!!back){
    //   this.setState({
    //     __back: back,
    //   })
    // }
  }
  componentDidUpdate(){
    // let back = localStorage.getItem('back');
    // let url = localStorage.getItem('backurl');

    // if(!!back && back != this.state.__back){
    //   this.setState({
    //     __back: back,
    //   })
    // }
  }
  

  backToTheFuture(){
    let back = localStorage.getItem('back');
    let url = localStorage.getItem('backurl');
    let placeId = localStorage.getItem('placeId');

    console.log("BACKK-------------")

  }

  static propTypes = {
  }

  render() {
    let {toTop} = this.state;
    if(toTop){
      // const {Redirect} = require('react-router');
      // return(
      //   <Redirect to='/Top'/>
      // )
    }
    return (
      <div className="svgBackBtn" onClick={this.backToTheFuture}>
        <Link to="/">
          <SvgBackTo />
        </Link>
      </div>
    )
  }
}

export default compose(
  graphql(getPrivateChat, { name: 'getChat' }),
  graphql(setPrivateChat, { name: 'setChat' }),
  graphql(setPlace, { name: 'setPlace' }),
  graphql(getPlace, { name: 'getPlace' }),
)(BtnBack);