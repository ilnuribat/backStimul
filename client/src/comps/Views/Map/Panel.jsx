import React from "react";
import {
  Marker,
  Popup,
} from "react-leaflet";
import { divIcon } from "leaflet";
import NavLink from "./NavLink";

const Panel = ({ data, name, click }) =>
  data.map((post) =>
  // post.status == type &&
    post.address && post.address.coordinates && post.address.coordinates.length > 0 && post.address.coordinates[0] && post.address.coordinates[1] ?
      <Marker key={post.id} position={post.address.coordinates} icon={SwitchIcon(1)}>
        <Popup >
          <div className="mapModal" >
            <ul>
              <li>Тип объекта: {name}</li>
              <li>Название объекта: {post.name}</li>
              <li>Адрес объекта: {post.address.value}</li>
              <li>Ответственный: <span className="userCloud2">{post.assignedTo && post.assignedTo.username}</span></li>
              <li>Последнее сообщение от <span className="userCloud2">{post.lastMessage && post.lastMessage.from.username} </span>
              : <span className="msgCloud">{post.lastMessage && post.lastMessage.text}</span></li>
            </ul>
            <div className="button">
              <NavLink index={post.id} name={post.name} onClick1={click} >Детальная информация</NavLink>
            </div>
          </div>
        </Popup>
      </Marker>
      :
      <span key={post.id} />
  )

const SwitchIcon = (status) => {
  let value;

  switch (status) {
  case 1:
    value = "pinRed";
    break;
  case 2:
    value = "pinYellow";
    break;
  case 3:
    value = "pinPurp";
    break;
  case 4:
    value = "pinBlue";
    break;
  default:
    value = "pinGreen";
  }

  return divIcon({
    className: value,
    iconSize: [50, 50],
  });
};


export default Panel
