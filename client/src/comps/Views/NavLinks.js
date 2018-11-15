import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';
import Modal from '../Lays/Modal';


const NavArr = [
  {name:"search", link:"/", comp:"", svg:"search"},
  {name:"Root", link:"/", comp:"", svg:"tiles"},
  {name:"3", link:"", comp:"", svg:"svg3"},
  {name:"Private", link:"/chat", comp:"", svg:"private"},
  {name:"Pap", link:"/map", comp:"", svg:"location"},
  {name:"Modal", link:"", comp:"", svg:"modal", click:"modal"},
];

export default class NavLinks extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       modal: false,
    }

    this.modal = this.modal.bind(this)
  }
  
  modal(){
    this.setState({
      modal: !this.state.modal,
    })
  }

  static propTypes = {
  }

  render() {
    let {children} = this.props;
    let {modal} = this.state;

    return (
      <div className="NavLinks">
        {children}
        {
          NavArr.map((e,i)=>{
            return(
              <div className="nav" key={"nav"+i+e.link} onClick={()=>{e.click === "modal" ? this.modal() : console.log('No click')} }>
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
        {modal ? (<Modal close={this.modal} small=""/>) : null}
      </div>
    )
  }
}
