import React from 'react';

const Tile = ({_id,name,query, click, type}) => (
  <div key={_id} className="tile" onClick={()=>click(_id,type,name)}>
    {name ? (<div className="tile-name">{name}</div>) : null }
    {_id ? (<div className="tile-id">{_id}</div>) : null }
  </div>
)

export default Tile
