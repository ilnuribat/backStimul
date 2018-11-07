import React, { Component } from 'react'
import TileMaker from './TileMaker';


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
  }

  render ()   {
    const {_id, name, click, type, updateObject, refetch, parentId} = this.props
    const { edit } = this.state

    if(edit){
      console.warn("EEEDIT")

      return <TileMaker editObject={true} id={_id} name={name} parentId={parentId} setEdit={this.setEdit}/>
    }else{


      return(
        <div key={_id} className="tile">
          <div onClick={()=>click(_id,type,name, parentId)}>
            {name ? (<div className="tile-name">{name}</div>) : null }
            {_id ? (<div className="tile-id">{_id}</div>) : null }
          </div>
          {type === 'object' ? (
            <div className="pWrapper">
              <div className="button" onClick={()=>refetch(_id, parentId)} >Удалить</div>
              <div className="button" onClick={this.setEdit} >Редактировать</div>
            </div> ) : null}

        </div>
      )
    }
  }
}


