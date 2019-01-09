import React, { Component } from "react";
import Axios from "axios";
import {
  LayerGroup,
  LayersControl,
  Map,
  Popup,
  TileLayer,
} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Query } from "react-apollo";
import M from 'leaflet-control-geocoder'
import { Redirect } from "react-router-dom";
import { ReactLeafletSearch } from 'react-leaflet-search'

import "./LeafletMap.css";

import { getObjects } from '../../../GraphQL/Qur/Query/index';
import Loading from '../../Loading';
import Content from '../../Lays/Content';
// import { getPlaceName, setPlaceName } from "../../../GraphQL/Cache";
import MapInfo from "./MapInfo";
import TileMaker from '../../Parts/TileMaker';
import Panel from "./Panel";
import Modal, {ModalRowName} from "../../Lays/Modal/Modal";

import states from "./kadastrBase/states.json"
import utilizations from "./kadastrBase/utilizations.json"
import parcelOwnership from "./kadastrBase/parcelOwnership.json"
import categoryTypes from "./kadastrBase/categoryTypes.json"


const { BaseLayer, Overlay } = LayersControl;

const styleLeaf = {
  margin: "0 0 0 0",
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
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      offsetWidth: 1024,
      offsetHeight: 768,
      objectId: "",
      edit: false,
      showReestr: false,
      address: "",
      reestr: {}
    };
    this.setEdit = this.setEdit.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    // console.warn("COORD", document.body.clientWidth,document.body.offsetHeight)
    // const { getPlaceName } = this.props;
    // let { setPlaceName } = this.props;
    // let place = 'Map';

    // if (getPlaceName && getPlaceName.placename != place) {
    //   setPlaceName({
    //     variables: {
    //       name: place,
    //     }
    //   })
    // }
    this.setState({
      offsetWidth: document.body.clientWidth,
      offsetHeight: document.body.offsetHeight
    });
  }

  daDataReqName (name) {
    Axios(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token a9a4c39341d2f4072db135bd25b751336b1abb83"
        },
        data: {
          "query": name,
          "count": 5
        }
      })
      .then(response => {
        if (response.data.suggestions.length > 0)
          this.setState({
            edit: !this.state.edit,
            address: response.data.suggestions
          })
      })
  }

  kadastrReqCoord (coords) {
    // console.warn(coords)
    Axios(
      `https://pkk5.rosreestr.ru/api/features/1?text=${coords.lat}%20${coords.lng}&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      .then(response => {
        if (response.data && response.data.features && response.data.features[0])
          this.kadastrReqCn(response.data.features[0].attrs.id)
      })
  }

  kadastrReqCn (cn) {
    Axios(
      `https://pkk5.rosreestr.ru/api/features/1/${cn}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      .then(response => {
        if (response.data && response.data.feature) {
          // console.warn(response.data.feature.attrs)
          this.setState({
            showReestr: true,
            reestr: response.data.feature.attrs
          })
        }
      })
  }

  setEdit(latlng) {
    this.kadastrReqCoord(latlng)
    new Promise((resolve, reject) => {
      M.L.Control.Geocoder.nominatim({
        htmlTemplate: ({ address }) => {
          const res = `${address.state} ${address.city || ''} ${address.county || ''} ${address.hamlet || ''} ${address.road || ''} ${address.house_number || ''}`;

          return res.replace(/\s+/g,' ').trim();
        }
      }).reverse(latlng, this.map ? this.map.leafletElement.getZoom() : 13, results => {
        if (results && results[0]) resolve(results[0].html)
        else reject("AAA")
      })
    })
      .then(
        result =>
          this.daDataReqName (result),
        error => console.warn("Rejected: " + error)
      );
  }

  customPopup(SearchInfo) {
    return (
      <Popup>
        <div>
          <p>I am a custom popUp</p>
          <p>latitude and longitude from search component: {SearchInfo.latLng.toString().replace(',', ' , ')}</p>
          <p>Info from search component: {SearchInfo.info}</p>
        </div>
      </Popup>
    );
  }

  handleTabChange = (index, name) => {
    // console.warn("clicked!", index, name);
    localStorage.setItem('ObjectId', index);
    localStorage.setItem('ObjectName', name);
    this.setState({ redirect: true, objectId: index });
  }

  closeModal () {
    this.setState({ showReestr: false });
  }

  render() {
    let { edit, address, reestr} = this.state;

    return (
      <Content >
        <Query query={getObjects}>
          {({ loading, data }) => {
            if (loading) {
              return (
                <div style={{ paddingTop: 20 }}>
                  <Loading />
                </div>
              );
            }

            if (data && data.objects) {

              let centerLon = 37.43
              let centerLat = 55.797
              let currentZoom = 10
              let minLat = 100.00
              let maxLat = 0.00
              let minLon = 100.00
              let maxLon = 0.00

              data.objects.map((post) => {
                if (!post.address || !post.address.coordinates || !post.address.coordinates[0] || !post.address.coordinates[1]) {

                  return true
                }

                if (minLat > parseFloat(post.address.coordinates[0])) minLat = parseFloat(post.address.coordinates[0])
                if (maxLat < parseFloat(post.address.coordinates[0])) maxLat = parseFloat(post.address.coordinates[0])
                if (minLon > parseFloat(post.address.coordinates[1])) minLon = parseFloat(post.address.coordinates[1])
                if (maxLon < parseFloat(post.address.coordinates[1])) maxLon = parseFloat(post.address.coordinates[1])

                return null
              })

              centerLon = (minLon + maxLon) / 2
              centerLat = (minLat + maxLat) / 2

              const WORLD_DIM = { height: 256, width: 256 };
              const ZOOM_MAX = 21;

              const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;

              const lngDiff = maxLon - minLon
              const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

              const latZoom = zoom(this.state.offsetHeight, WORLD_DIM.height, latFraction);
              const lngZoom = zoom(this.state.offsetWidth, WORLD_DIM.width, lngFraction);

              currentZoom = Math.min(latZoom, lngZoom, ZOOM_MAX);

              if (this.state.redirect) {
                return <Redirect to={{
                  pathname: '/board',
                  state: { objectId: this.state.objectId }
                }} />
              }

              const center = [centerLat, centerLon];

              return (
                <Map ref={(ref) => { this.map = ref }} center={center} zoom={currentZoom} style={styleLeaf} maxZoom="18"  >
                  <LayersControl position="topright" >
                    <BaseLayer checked name="Landscape">
                      <TileLayer
                        attribution="GUOV"
                        url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
                        zIndex="-2"
                      />
                    </BaseLayer>
                    <BaseLayer name="Черно-белая карта">
                      <TileLayer
                        attribution="GUOV"
                        url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                        zIndex="-2"
                      />
                    </BaseLayer>
                    <BaseLayer name="OpenCycleMap">
                      <TileLayer
                        attribution="GUOV"
                        url="https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
                      />
                    </BaseLayer>
                    <BaseLayer name="Цветная карта OSM " >
                      <TileLayer
                        attribution="GUOV"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </BaseLayer>
                    <BaseLayer name="Outdoors">
                      <TileLayer
                        attribution="GUOV"
                        url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
                      />
                    </BaseLayer>
                    <BaseLayer name="Neighbourhood">
                      <TileLayer
                        attribution="GUOV"
                        url="https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
                      />
                    </BaseLayer>
                    <BaseLayer name="Toner">
                      <TileLayer
                        attribution="GUOV"
                        url="http://tile.stamen.com/toner/{z}/{x}/{y}.png"
                      />
                    </BaseLayer>
                    <BaseLayer name="Terrain">
                      <TileLayer
                        attribution="GUOV"
                        url="http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg"
                      />
                    </BaseLayer>
                    <BaseLayer name="Watercolor">
                      <TileLayer
                        attribution="GUOV"
                        url="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
                      />
                    </BaseLayer>
                    <BaseLayer name="Spinal Map">
                      <TileLayer
                        attribution="GUOV"
                        url="https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=a6a77717902441f4a58bf630a325ab72"
                      />
                    </BaseLayer>
                    <BaseLayer name="Full Dark">
                      <TileLayer
                        attribution="GUOV"
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                      >
                      </TileLayer>
                    </BaseLayer>
                    {data.objects && (
                      <Overlay checked name="Задачи новые" >
                        <LayerGroup >
                          <MarkerClusterGroup>
                            <Panel type="1" name="Задача новая" data={data.objects} click={this.handleTabChange} />
                          </MarkerClusterGroup>
                        </LayerGroup>
                      </Overlay>)}
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
                      providerOptions={{ region: 'ru' }}

                    // default provider OpenStreetMap
                    // provider="BingMap"
                    // providerKey="AhkdlcKxeOnNCJ1wRIPmrOXLxtEHDvuWUZhiT4GYfWgfxLthOYXs5lUMqWjQmc27"
                    />
                    <MapInfo edit={edit} setEdit={this.setEdit} />
                  </LayersControl>
                  {edit && <TileMaker edit={true} address={address} setEdit={() => { this.setState({ edit: !edit }) }} />}
                  {this.state.showReestr && (
                    <Modal close={this.closeModal} size="450">
                      <ModalRowName name="Кад.номер:">{reestr.cn}</ModalRowName>
                      <ModalRowName name="Кад.квартал:">{reestr.kvartal_cn}</ModalRowName>
                      {reestr.name && <ModalRowName name="Наименование:">{reestr.name}</ModalRowName>}
                      {reestr.address && <ModalRowName name="Информация:"> {reestr.address}</ModalRowName>}
                      {reestr.cad_cost && <ModalRowName name="Кадастровая стоимость:"> {reestr.cad_cost} рублей</ModalRowName>}
                      {reestr.area_value && <ModalRowName name="Общая площадь:">{reestr.area_value} кв.м</ModalRowName>}
                      {reestr.statecd && <ModalRowName name="Статус:"> {states[reestr.statecd]}</ModalRowName>}
                      {reestr.category_type && <ModalRowName name="Категория земель:"> {categoryTypes[reestr.category_type]}</ModalRowName>}
                      {reestr.fp && <ModalRowName name="Форма собственности:"> {parcelOwnership[reestr.fp]}</ModalRowName>}
                      {reestr.util_code && <ModalRowName name="Разрешенное использование:"> {utilizations[reestr.util_code]}</ModalRowName>}
                      {reestr.util_by_doc && <ModalRowName name="по документу:"> {reestr.util_by_doc}</ModalRowName>}
                      {reestr.date_create && <ModalRowName name="Дата постановки на учет:"> {reestr.date_create}</ModalRowName>}
                      {reestr.cad_record_date && <ModalRowName name="Дата изменения сведений в ГКН:"> {reestr.cad_record_date}</ModalRowName>}
                      {reestr.adate && <ModalRowName name="Дата выгрузки сведений из ГКН:"> {reestr.adate}</ModalRowName>}
                    </Modal>
                  )}
                </Map>
              );
            } else {
              return (
                <div>Нет данных</div>
              )
            }
          }}
        </Query>
      </Content>
    )
  }
}

export default LeafletMap;
