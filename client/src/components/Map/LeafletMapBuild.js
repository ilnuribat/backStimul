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


function latRad(lat) {
  var sin = Math.sin(lat * Math.PI / 180);
  var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;

  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoom(mapPx, worldPx, fraction) {
  return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}


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
      // console.warn("clicked!", index, name);
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

    // componentDidMount() {
    //   console.warn(this.refs.leaflet.leafletElement.getBounds() )
    // }

    render() {
      const { getCUser } = this.props;
      let centerLon = 37.43
      let centerLat = 55.797

      if (getCUser.user) {
        let minLat = 100.00
        let maxLat = 0.00
        let minLon = 100.00
        let maxLon = 0.00

        getCUser.user.groups.map((post) => {

          // console.warn(post)
          minLat > parseFloat(post.address.coordinates[0]) ? minLat = parseFloat(post.address.coordinates[0]) : null
          maxLat < parseFloat(post.address.coordinates[0]) ? maxLat = parseFloat(post.address.coordinates[0]) : null
          minLon > parseFloat(post.address.coordinates[1]) ? minLon = parseFloat(post.address.coordinates[1]) : null
          maxLon < parseFloat(post.address.coordinates[1]) ? maxLon = parseFloat(post.address.coordinates[1]) : null
        })

        // console.warn(minLat, maxLat, minLon, maxLon)
        centerLon = (minLon + maxLon)/2
        centerLat = (minLat + maxLat)/2

        // let WORLD_DIM = { height: 256, width: 256 };
        // let ZOOM_MAX = 21;

        // let ne = bounds.getNorthEast();
        // var sw = bounds.getSouthWest();

        // var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

        // var lngDiff = ne.lng() - sw.lng();
        // var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

        // var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
        // var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

        // return Math.min(latZoom, lngZoom, ZOOM_MAX);


      }
      if (this.state.redirect) {
        return <Redirect push to="/" />;
      }

      const center = [centerLat, centerLon];

      return (
        <Map center={center} zoom={8} style={styleLeaf} >
          <LayersControl position="topright" >
            <BaseLayer  checked name="Landscape">
              <TileLayer
                attribution="GUOV"
                url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
              />
            </BaseLayer>

            <BaseLayer  name="Черно-белая карта">
              <TileLayer
                attribution="GUOV"
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer  name="OpenCycleMap">
              <TileLayer
                attribution="GUOV"
                url="https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
              />
            </BaseLayer>
            <BaseLayer  name="Цветная карта OSM " >
              <TileLayer
                attribution="GUOV"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer  name="Outdoors">
              <TileLayer
                attribution="GUOV"
                url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
              />
            </BaseLayer>
            <BaseLayer  name="Neighbourhood">
              <TileLayer
                attribution="GUOV"
                url="https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
              />
            </BaseLayer>
            <BaseLayer  name="Toner">
              <TileLayer
                attribution="GUOV"
                url="http://tile.stamen.com/toner/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer  name="Terrain">
              <TileLayer
                attribution="GUOV"
                url="http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg"
              />
            </BaseLayer>
            <BaseLayer  name="Watercolor">
              <TileLayer
                attribution="GUOV"
                url="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
              />
            </BaseLayer>
            <BaseLayer  name="Spinal Map">
              <TileLayer
                attribution="GUOV"
                url="https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
              />
            </BaseLayer>
            <BaseLayer  name="Full Dark">
              <TileLayer
                attribution="GUOV"
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
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
  // console.warn(data.user.groups)

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
                <li>Ответственный: <span className="userCloud2">{post.assignedTo ? post.assignedTo.username : null}</span></li>
                <li>Последнее сообщение от <span className="userCloud2">{post.lastMessage ? post.lastMessage.from.username : null} </span>: <span className="msgCloud">{post.lastMessage ? post.lastMessage.text : null}</span></li>
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