import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SvgEdit, SvgRem } from '../SVG';
import TileMaker from '../TileMaker/index';

/** Tile container */

class Tile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
    }
    this.edit = this.edit.bind(this);
  }

  edit(){

  }

  static propTypes = {
  }

  render() {
    let {edit} = this.state;
    let {children, name, descr, id, click, parentId, type, refetch} = this.props;

    if(edit){
      return(
        <TileMaker edit={true} setEdit={()=>{this.setState({edit: !edit})}} />
      )
    }else{
      return (
        <div className="Tile">
          {type === "Object" ? (<div className="Edit" onClick={()=>{this.setState({edit:!edit})}}><SvgEdit /></div>) : null}
          {type === "Object" ? (<div className="Rem" onClick={()=>refetch(id, parentId)}><SvgRem /></div>) : null}
          <div className="name" onClick={()=>click({id:id,type:type,name:name, parentId:parentId})}>{name}</div>
          <div className="descr">{descr}</div>
          {/* <div className="id">{id}</div> */}
          <div className="type">{type}</div>
        </div>
      )
    }
  }
}
export default Tile
