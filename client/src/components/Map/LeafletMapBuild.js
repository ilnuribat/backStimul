import React, { PureComponent } from "react";
import {
  LayerGroup,
  LayersControl,
  Map,
  Marker,
  Popup,
  TileLayer
} from "react-leaflet";
import { divIcon } from "leaflet";
import {Redirect} from "react-router-dom";
import Indicator from "./Indicator";
import newdata from "./Objects";
import b from "./buttons.css";
import s from "./LeafletMap.css";
 
const { BaseLayer, Overlay } = LayersControl;

const styleLeaf = {
  height: "79vh",
  width: "100%",
  margin: "0 auto",
};

/* const iconLearn = divIcon({
    className: "fa-icon222",
    // eslint-disable-next-line
    html: '<i className="fa fa-graduation-cap fa-2x" style="color:blue"></i>',
});
 */

export default class LeafletMap extends PureComponent {
    state = {
      redirect: false,
      redirectDetail: false,
    };
    handleTabChange = (index) => {
      // console.warn("clicked!", index);
      this.setState({redirect: true});
    }

    handleTabDetail = (index) => {
      // console.warn("clicked!", index);
      this.setState({redirectDetail: true});
    }


    render() {
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
          </LayersControl>
        </Map>
      );
    }
}


const Panel = ({ type, name, click, clickDetail })  => {
  return (
    newdata.map((post) =>
      post.type == type ?
        <Marker key={post.id} position={post.coordinates} icon={SwitchIcon(name, post.status)}> 
          <Popup >
            <div className={s.modal} >
              <div className={s.photo}><img src={post.photo} alt="fdd" className={s.photo} /></div>
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
              <div className={s.bigButton}>
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
      value = s.schoolYellow;
      break;
    case 3:
      value = s.schoolRed;
      break;
    default:
      value = s.schoolBlue;
    }
    break;
  case "Здравоохранение":
    switch (status) {
    case 2: 
      value = s.healthYellow;
      break;
    case 3:
      value = s.healthRed;
      break;
    default:
      value = s.healthBlue;
    }
    break;
  case "Культура":
    switch (status) {
    case 2: 
      value = s.cultureYellow;
      break;
    case 3:
      value = s.cultureRed;
      break;
    default:
      value = s.cultureBlue;
    }
    break;
  case "Спорт":
    switch (status) {
    case 2: 
      value = s.sportYellow;
      break;
    case 3:
      value = s.sportRed;
      break;
    default:
      value = s.sportBlue;
    }
    break;
  default:
    value = s.iconBlue;
  }

  return divIcon({
    className: value,
    iconSize: [50, 50],
  });
};