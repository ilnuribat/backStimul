import React, { PureComponent } from 'react'


export default ({_id,name,query, click, type})=>{

  return(
    <div key={_id} className="tile" onClick={()=>click(_id,type,name)}>
      {name ? (<div className="tile-name">{name}</div>) : null }
      {_id ? (<div className="tile-id">{_id}</div>) : null }
    </div>
  )
}