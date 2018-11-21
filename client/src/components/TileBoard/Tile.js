import React, { Component } from 'react'
import TileMaker from './TileMaker';
import { SvgEdit } from '../../comps/Parts/SVG';


export default class Tile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      edit: false
    }
    this.setEdit = this.setEdit.bind(this)
  }

  setEdit () {
    this.setState ({edit: !this.state.edit})
    this.state.edit ?  this.props.refetch() : null
  }

  render ()   {
    const {_id, name, click, type, updateObject, refetch, parentId, addr} = this.props
    const { edit } = this.state

    if(edit){
      console.warn("EEEDIT")

      return <TileMaker edit={true} addr={addr} id={_id} name={name} parentId={parentId} setEdit={this.setEdit}/>
    }else{


      return(
        <div key={_id} className="tile">
          {type === "Object" ? (<SvgEdit />) : null}
          <div onClick={()=>click(_id,type,name, parentId)}>
            {name ? (<div className="tile-name">{name}</div>) : null }
            {addr ? (<div className="tile-addr">{addr}</div>) : null }
            {_id ? (<div className="tile-id">{_id}</div>) : null }
          </div>
          {type === 'Object' ? (
            <div className="pWrapper">
              <div className="button" onClick={()=>refetch(_id, parentId)} >Удалить</div>
              <div className="button" onClick={this.setEdit} >Редактировать</div>
            </div> ) : null}

        </div>
      )
    }
  }
}


