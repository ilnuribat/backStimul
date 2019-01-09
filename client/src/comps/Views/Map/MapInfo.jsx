import { withLeaflet, MapControl } from "react-leaflet";
import L from "leaflet";

class MapInfo extends MapControl {
  constructor(props) {
    super(props);
    this.state = {
      layer: ""
    }

    props.leaflet.map.addEventListener("mousemove", ev => {
      this.panelDiv.innerHTML = `<h2><span>Lat: ${ev.latlng.lat.toFixed(
        4
      )}</span>&nbsp;<span>Lng: ${ev.latlng.lng.toFixed(4)}</span></h2>`;
    });
    props.leaflet.map.addEventListener("click", ev => {
      if ( !this.props.edit ) {
        // console.warn(this.panelDiv.innerHTML);
        this.props.setEdit(ev.latlng)
        // this.props.leaflet.map.removeLayer(this.state.layer);
      }
      // new L.marker(ev.latlng).addTo(this.props.leaflet.map);
    });
  }

  createLeafletElement() {
    const MapInfo = L.Control.extend({
      onAdd: () => {
        this.panelDiv = L.DomUtil.create("div", "info");

        return this.panelDiv;
      }
    });

    return new MapInfo({ position: "bottomleft" });
  }

  createLayer () {
    const { map } = this.props.leaflet;

    L.TileLayer.Rosreestr = L.TileLayer.extend({
      options: {
        tileSize: 1024,
      },
      getTileUrl: function (tilePoint) {
        var map = this._map,
          crs = map.options.crs,
          tileSize = 1024,
          nwPoint = tilePoint.multiplyBy(tileSize),
          sePoint = nwPoint.add([tileSize, tileSize]);

        var nw = crs.project(map.unproject(nwPoint, tilePoint.z)),
          se = crs.project(map.unproject(sePoint, tilePoint.z)),
          bbox = [nw.x, se.y, se.x, nw.y].join(',');

        return L.Util.template(this._url, L.extend({
          s: this._getSubdomain(tilePoint),
          bbox: bbox
        }));
      }
    });

    L.tileLayer.rosreestr = function() {
      return new L.TileLayer.Rosreestr(
        "https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show&dpi=96&format=PNG32&bbox=${bbox}&size=1024%2C1024&transparent=true&f=image");
    }

    // let layer = L.tileLayer.rosreestr().addTo(map);
    L.control.layers(null, {Кадастр: L.tileLayer.rosreestr({},{ minZoom: 2, maxZoom: 18}) },{collapsed: false}).addTo(map);
  }

  componentDidMount() {
    const { map } = this.props.leaflet;

    this.leafletElement.addTo(map);
    this.createLayer()
  }

}

export default withLeaflet(MapInfo);
