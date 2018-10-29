import React, { PureComponent } from "react";
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
import { getCUser } from '../../graph/querys';
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


class LeafletMap extends PureComponent {
    state = {
      redirect: false,
      redirectDetail: false,
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


    handleTabChange = (index) => {
      // console.warn("clicked!", index);
      this.setState({redirect: true});
    }

    handleTabDetail = (index) => {
      // console.warn("clicked!", index);
      this.setState({redirectDetail: true});
    }


    render() {
      const { getCUser } = this.props;

      console.warn (getCUser.user)

      if (this.state.redirect) {
        return <Redirect push to="/build_analytics" />;
      }
      if (this.state.redirectDetail) {
        return <Redirect push to="/build_info" />;
      }
      const center = [55.797, 38.43];

      return (
        <Map center={center} zoom={15} style={styleLeaf} >

          <LayersControl position="topright" >
            <BaseLayer  checked name="Цветная карта">
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
            <Overlay checked name="Образовательное учреждение">
              <LayerGroup >
                <Panel type="1" name="Образовательное учреждение" click={this.handleTabChange} clickDetail={this.handleTabDetail}/>
              </LayerGroup>
            </Overlay>
            <Overlay checked name="Здравоохранение">
              <LayerGroup >
                <Panel type="2" name="Здравоохранение" click={this.handleTabChange} clickDetail={this.handleTabDetail}/>
              </LayerGroup>
            </Overlay>
            <Overlay checked name="Культура">
              <LayerGroup >
                <Panel type="3" name="Культура"  click={this.handleTabChange} clickDetail={this.handleTabDetail}/>
              </LayerGroup>
            </Overlay>
            <Overlay checked name="Спорт">
              <LayerGroup >
                <Panel type="4" name="Спорт"  click={this.handleTabChange} clickDetail={this.handleTabDetail}/>
              </LayerGroup>
            </Overlay>
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


const ddd = divIcon({
  className: "schoolRed",
  iconSize: [50, 50],
});


const Panel = ({ type, name, click, clickDetail })  => {
  return (
    newdata.map((post) =>
      post.type == type ?
        <Marker key={post.id} position={post.coordinates} icon={SwitchIcon(name, post.status)}>
          <Popup >
            <div className="modal" >
              <div className="photo"><img src={post.photo} alt="fdd" className="photo" /></div>
              <br/>
              <ul>
                <li>Тип объекта: {name}</li>
                <li>Название объекта: {post.name}</li>
                <li>Руководитель: {post.owner}</li>
                <li>Адрес: {post.address}</li>
                <li>Статус:<span  style={{"verticalAlign": "-4px"}}>
                  <span  style={{ "marginLeft":"2%"}}><Indicator tittle="По основному виду деятельности" stroke={(post.status === 3  ? "#ed4d31" : (post.status === 2 ? "#efa900" : "#7fb800"))} /></span>
                  <span  style={{ "marginLeft":"2%"}}><Indicator tittle="Качество управления" stroke={(post.status1 === 3  ? "#ed4d31" : (post.status1 === 2 ? "#efa900" : "#7fb800"))} /></span>
                  <span  style={{ "marginLeft":"2%"}}><Indicator tittle="Оценка деятельности" stroke={(post.status2 === 3  ? "#ed4d31" : (post.status2 === 2 ? "#efa900" : "#7fb800"))} /></span>
                </span>
                </li>
              </ul>
              <div className="bigButton">
                <NavLink index={post.id} onClick1={clickDetail} btnColor={b.btnBlue}>Детальная информация</NavLink>
              </div>
              {/* <NavLink index={post.id} onClick1={clickDetail}>Детальная информация</NavLink> */}
              <div className={`modal-footer ${b.third_btns}`}>
                <NavLink index={post.id} onClick1={click} btnColor={b.btnGreen}>Аналитика</NavLink><span> </span>
                <button type="button" className={b.btn + " " + b.btnDark}>Датчики/Счетчики</button>
                <button type="button" className={b.btn + " " + b.btnDark}>KPI</button>
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
      this.props.onClick1(this.props.index);
    }
    render() {
      return (
        <button type="button" onClick={this.handleClick} className={b.btn + " " + this.props.btnColor} style={{ "width":"100%", "height":"39px"}} >{this.props.children}</button>
      );
    }
}



const SwitchIcon = (name, status)   => {
  let value;

  switch (name) {
  case "Образовательное учреждение":
    switch (status) {
    case 2:
      value = "schoolYellow";
      break;
    case 3:
      value = "schoolRed";
      break;
    default:
      value = "schoolBlue";
    }
    break;
  case "Здравоохранение":
    switch (status) {
    case 2:
      value = "healthYellow";
      break;
    case 3:
      value = "healthRed";
      break;
    default:
      value = "healthBlue";
    }
    break;
  case "Культура":
    switch (status) {
    case 2:
      value = "cultureYellow";
      break;
    case 3:
      value = "cultureRed";
      break;
    default:
      value = "cultureBlue";
    }
    break;
  case "Спорт":
    switch (status) {
    case 2:
      value = "sportYellow";
      break;
    case 3:
      value = "sportRed";
      break;
    default:
      value = "sportBlue";
    }
    break;
  default:
    value = "iconBlue";
  }

  return divIcon({
    className: value,
    iconSize: [50, 50],
  });
};


LeafletMap.propTypes = {
  getCUser: PropTypes.object.isRequired
};


export default compose(
  graphql(getCUser, { name: 'getCUser' }),
)(LeafletMap);