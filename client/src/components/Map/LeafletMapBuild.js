import React, { Component, Fragment } from "react";
import {
  LayerGroup,
  LayersControl,
  Map,
  Marker,
  Popup,
  TileLayer
} from "react-leaflet";
import { graphql, compose } from "react-apollo";
import { divIcon } from "leaflet";
import PropTypes from 'prop-types';
import {Redirect} from "react-router-dom";
import { ReactLeafletSearch } from 'react-leaflet-search'
import { getCUser, setPrivateChat } from '../../graph/querys';
import Indicator from "./Indicator";
import newdata from "./Objects";
import b from "./buttons.css";
import  "./LeafletMap.css";

const { BaseLayer, Overlay } = LayersControl;

const styleLeaf = {
  margin: "0 0 0 50px",
  height: "100vh",
  width: "auto",


};


class LeafletMap extends Component {
    state = {
      redirect: false,
    };

    customPopup(SearchInfo) {
      return(
        <Popup>
          <div>
            <p>I am a custom popUp</p>
            <p>latitude and longitude from search component: {SearchInfo.latLng.toString().replace(',',' , ')}</p>
            <p>Info from search component: {SearchInfo.info}</p>
          </div>
        </Popup>
      );
    }

    handleTabChange = (index, name) => {
      console.warn("clicked!", index, name);
      this.props.setPrivateChat({
        variables: {
          id: index,
          name: name,
          priv: false,
          unr: 0,
        }
      });
      this.setState({redirect: true});
    }


    render() {
      const { getCUser } = this.props;

      // console.warn (getCUser.user)

      if (this.state.redirect) {
        return <Redirect push to="/" />;
      }

      const center = [55.797, 37.43];

      return (
        <Map center={center} zoom={8} style={styleLeaf} >

          <LayersControl position="topright" >
            <BaseLayer  checked name="Цветная карта" >
              <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer  name="Черно-белая карта">
              <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            {
              getCUser.user ? (
                <Overlay checked name="Задачи новые" >
                  <LayerGroup >
                    <Panel type="1" name="Задача новая" data={getCUser} click={this.handleTabChange} />
                  </LayerGroup>
                </Overlay>) : null }
            {
              getCUser.user ? (
                <Overlay checked name="Задачи неназначенные">
                  <LayerGroup >
                    <Panel type="2" name="Задача неназначенная" data={getCUser} click={this.handleTabChange} />
                  </LayerGroup>
                </Overlay>) : null }
            {
              getCUser.user ? (
                <Overlay checked name="Задачи в работе">
                  <LayerGroup >
                    <Panel type="3" name="Задача в работе"  data={getCUser} click={this.handleTabChange} />
                  </LayerGroup>
                </Overlay>) : null }
            {
              getCUser.user ? (
                <Overlay checked name="Задачи на согласовании">
                  <LayerGroup >
                    <Panel type="4" name="Задача на согласовании"  data={getCUser} click={this.handleTabChange} />
                  </LayerGroup>
                </Overlay>) : null }
            {
              getCUser.user ? (
                <Overlay checked name="Задачи завершенные">
                  <LayerGroup >
                    <Panel type="5" name="Задача завершенная"  data={getCUser} click={this.handleTabChange} />
                  </LayerGroup>
                </Overlay>) : null }
            <ReactLeafletSearch
              position="topleft"

              showMarker={true}
              zoom={15}
              showPopup={true}
              popUp={this.customPopup}
              closeResultsOnClick={true}
              openSearchOnLoad={true}
              // // these searchbounds would limit results to only Turkey.
              // searchBounds = {
              //   [
              //     [33.100745405144245, 46.48315429687501],
              //     [44.55916341529184, 24.510498046875]
              //   ]
              // }
              providerOptions={{region: 'ru'}}

              // default provider OpenStreetMap
              // provider="BingMap"
              // providerKey="AhkdlcKxeOnNCJ1wRIPmrOXLxtEHDvuWUZhiT4GYfWgfxLthOYXs5lUMqWjQmc27"
            />
          </LayersControl>

        </Map>
      );
    }
}


// const ddd = divIcon({
//   className: "schoolRed",
//   iconSize: [50, 50],
// });


const Panel = ({ data, type, name, click })  => {
  console.warn(data.user.groups)

  return (
    data.user.groups.map((post) =>
      post.status == type && post.address.coordinates.length >0 ?
        <Marker key={post.id} position={post.address.coordinates} icon={SwitchIcon(post.status)}>
          <Popup >
            <div className="modal" >
              <ul>
                <li>Тип объекта: {name}</li>
                <li>Название объекта: {post.name}</li>
                <li>Адрес объекта: {post.address.value}</li>
                <li>Ответственный: {post.assignedTo ? post.assignedTo.username : null}</li>
                <li>Последнее сообщение от {post.lastMessage ? post.lastMessage.from.username : null} : {post.lastMessage ? post.lastMessage.text : null}</li>
              </ul>
              <div className="btn">
                <NavLink index={post.id} name={post.name} onClick1={click} btnColor={b.btnBlue}>Детальная информация</NavLink>
              </div>
            </div>
          </Popup>
        </Marker>
        :
        <span key={post.id} />
    )
  );
};


class NavLink extends React.Component {
    handleClick = () => {
      this.props.onClick1(this.props.index, this.props.name);
    }
    render() {
      return (
        <button type="button" onClick={this.handleClick} className={b.btn + " " + this.props.btnColor} style={{ "width":"100%", "height":"39px"}} >{this.props.children}</button>
      );
    }
}



const SwitchIcon = (status)   => {
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


LeafletMap.propTypes = {
  getCUser: PropTypes.object.isRequired,
  setPrivateChat: PropTypes.func.isRequired
};


export default compose(
  graphql(getCUser, { name: 'getCUser' }),
  graphql(setPrivateChat, { name: 'setPrivateChat' }),
)(LeafletMap);
