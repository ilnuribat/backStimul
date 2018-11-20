import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';
import Modal from '../Lays/Modal';
import { graphql, compose } from "react-apollo";
import { sBar, gBar, setPlace, getPlace } from '../../GraphQL/Cache';

const search = (props)=>{
  console.log("Seacrh")
  console.log(props)
} 

const NavArr = [
  {name:"search", comp:"", svg:"search", click:(e)=>{search(e)}},
  {name:"Root", link:"/", comp:"", svg:"dash"},
  {name:"Private", link:"/chat", comp:"", svg:"chat"},
  {name:"Pap", link:"/map", comp:"", svg:"map"},
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
    console.log('Search click')


    this.props.sBar({
      variables:{
        barType: 'Search',
        barShow: !this.props.gBar.barShow,
      }
    })
  }

  place(place){
    console.log('Place click', place)

    this.props.setPlace({
      variables:{
        id: "no",
        name: place,
        type: place,
      }
    })
  }


  static propTypes = {
  }

  render() {
    let {children, sBar, getPlace} = this.props;
    let {modal, NavArr} = this.state;

    return (
      <div className="NavLinks">
        {children}
        {
          NavArr.map((e,i)=>{
            return(
              //<div className="nav" key={"nav"+i+e.link} onClick={()=>{e.click === "modal" ? this.modal() : console.log('No click')} }>
              <div className={getPlace && getPlace.placename == e.name ? "nav selected" : "nav"} key={"nav"+i+e.link} onClick={()=>{e.click && typeof e.click === 'function' ? e.click() : console.log('No click')} }>
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
  graphql(setPlace, { name: 'setPlace' }),
  graphql(getPlace, { name: 'getPlace' }),
)(NavLinks);