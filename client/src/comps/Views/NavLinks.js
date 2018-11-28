import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';
import Modal from '../Lays/Modal';
import { graphql, compose } from "react-apollo";
import { sBar, gBar, setPlaceName, getPlaceName } from '../../GraphQL/Cache';

const search = (props)=>{
} 

const NavArrS = [
  {name:"color", comp:"", svg:"search", click:()=>{this.search()}},
];

class NavLinks extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      modal: false,
      NavArr: [
        {name:"search", comp:"", svg:"search", click:()=>{this.search()}},
        {name:"Root", link:"/", comp:"", svg:"dash", click:()=>{this.place('Root')}},
        {name:"Private", link:"/chat", comp:"", svg:"chat", click:()=>{this.place('Private')}},
        {name:"Map", link:"/map", comp:"", svg:"map", click:()=>{this.place('Map')}},
      ],
    }

    this.modal = this.modal.bind(this)
    this.search = this.search.bind(this)
    this.place = this.place.bind(this)
  }
  
  modal(){
    this.setState({
      modal: !this.state.modal,
    })
  }

  search(){
    this.props.sBar({
      variables:{
        barType: 'Search',
        barShow: !this.props.gBar.barShow,
      }
    })
  }

  place(place){
    this.props.setPlaceName({
      variables:{
        name: place,
      }
    })
  }


  static propTypes = {
  }

  render() {
    let {children, sBar, getPlaceName} = this.props;
    let {modal, NavArr} = this.state;

    return (
      <div className="NavLinks">
        {children}
        {
          NavArr.map((e,i)=>{
            return(
              <div className={getPlaceName && getPlaceName.placename == e.name ? "nav selected" : "nav"} key={"nav"+i+e.link} onClick={()=>{e.click && typeof e.click === 'function' ? e.click() : console.log('No click')} }>
                {e.link ? (
                  <Link to={e.link}>
                    <Svg svg={e.svg} />
                  </Link>
                ) : (
                  <Svg svg={e.svg} />
                ) }

              </div>
            )
          })
        }
        {modal ? (<Modal close={this.modal}/>) : null}
      </div>
    )
  }
}

export default compose(
  graphql(sBar, { name: 'sBar' }),
  graphql(gBar, { name: 'gBar' }),
  graphql(setPlaceName, { name: 'setPlaceName' }),
  graphql(getPlaceName, { name: 'getPlaceName' }),
)(NavLinks);