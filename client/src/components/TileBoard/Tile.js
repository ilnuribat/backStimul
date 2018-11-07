import React from 'react';
import { deleteObject } from '../../graph/querys';
import { qauf, _url } from '../../constants';

const Tile = ({_id, name, click, type, updateObject, refetch}) => (
  <div key={_id} className="tile">
    <div onClick={()=>click(_id,type,name)}>
      {name ? (<div className="tile-name">{name}</div>) : null }
      {_id ? (<div className="tile-id">{_id}</div>) : null }
    </div>
    {type === 'object' ? (
      <div className="pWrapper">
        <div className="button" onClick={()=>{deleteObjectNow(_id); refetch()}} >Удалить</div>
        <div className="button" onClick={()=>{updateObject(_id, name)}} >Редактировать</div>
      </div> ) : null}
  </div>
)

function deleteObjectNow(id) {
  qauf(deleteObject(id), _url, localStorage.getItem('auth-token')).then(a=>{
    console.warn(a)
  }).catch((e)=>{
    console.warn(e);
  });

}

export default Tile
