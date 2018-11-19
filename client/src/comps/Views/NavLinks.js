import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Svg } from '../Parts/SVG/index';
import Modal from '../Lays/Modal';
import { graphql, compose } from "react-apollo";
import { setBar } from '../../GraphQL/Cache';

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
              //<div className="nav" key={"nav"+i+e.link} onClick={()=>{e.click === "modal" ? this.modal() : console.log('No click')} }>
              <div className="nav" key={"nav"+i+e.link} onClick={()=>{e.click ? e.click(this.props.setBar) : console.log('No click')} }>
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
  graphql(setBar, { name: 'setBar' }),
)(NavLinks);