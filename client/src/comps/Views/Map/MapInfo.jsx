import { withLeaflet, MapControl } from "react-leaflet";
import L from "leaflet";

class MapInfo extends MapControl {
  constructor(props, context) {
    super(props);
    props.leaflet.map.addEventListener("mousemove", ev => {
      this.panelDiv.innerHTML = `<h2><span>Lat: ${ev.latlng.lat.toFixed(
        4
      )}</span>&nbsp;<span>Lng: ${ev.latlng.lng.toFixed(4)}</span></h2>`;
    });
    props.leaflet.map.addEventListener("click", ev => {
      if ( !this.props.edit ) {
        // console.warn(this.panelDiv.innerHTML);
        this.props.setEdit(ev.latlng)
      }
      // new L.marker(ev.latlng).addTo(this.props.leaflet.map);
    });
  }

  createLeafletElement(opts) {
    const MapInfo = L.Control.extend({
      onAdd: map => {
        this.panelDiv = L.DomUtil.create("div", "info");

        return this.panelDiv;
      }
    });

    return new MapInfo({ position: "bottomleft" });
  }

  componentDidMount() {
    const { map } = this.props.leaflet;

    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(MapInfo);
