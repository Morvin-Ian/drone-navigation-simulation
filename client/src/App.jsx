import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import useSWR from 'swr';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Facilities from './components/Facilities';
import Drones from './components/Drones';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Search = (props) => {
  const map = useMap();
  const { provider } = props;
  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [props]);
  return null;
};

const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (start && end) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ],
        routeWhileDragging: true,
      }).addTo(map);

      return () => map.removeControl(routingControl);
    }
  }, [map, start, end]);

  return null;
};

export const icon = new L.Icon({
  iconUrl: 'drone.png',
  iconSize: [60, 50],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

function App() {
  const center = [0.3556, 37.5833];
  const zoom = 7;

  const { data, error } = useSWR('/api/facilities/', fetcher);
  const { data: drones, error: dronesError } = useSWR('/api/drones/', fetcher);

  const facilities = data && !error ? data : {};
  const fetchedDrones = drones && !dronesError ? drones : {};

  const [activeFacility, setActiveFacility] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [route, setRoute] = useState(null);
  const mapRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = new OpenStreetMapProvider();

    const startResults = await provider.search({ query: start });
    const endResults = await provider.search({ query: end });

    if (startResults.length > 0 && endResults.length > 0) {
      const startCoords = [startResults[0].y, startResults[0].x];
      const endCoords = [endResults[0].y, endResults[0].x];
      setRoute({ start: startCoords, end: endCoords });

      // Fit the map to the route
      const bounds = L.latLngBounds(startCoords, endCoords);
      mapRef.current.fitBounds(bounds);
    } else {
      alert('Could not find one or both locations');
    }
  };

  if (error) {
    return <Alert variant="danger">Failure occurred when Fetching Facilities!</Alert>;
  }
  if (!data) {
    return (
      <Spinner
        animation="border"
        variant="success"
        role="status"
        style={{
          width: '200px',
          height: '200px',
          marginTop: '15%',
          marginLeft: '45%',
          display: 'block',
        }}
      />
    );
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <MapContainer center={center} zoom={zoom} ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Search provider={new OpenStreetMapProvider()} />
          <Facilities facilities={facilities} setActiveFacility={setActiveFacility} />
          <Drones drones={fetchedDrones} />
          {route && <RoutingMachine start={route.start} end={route.end} />}
        </MapContainer>

        <div className="route-form-container">
          <h3>Generate Routes</h3>
          <form onSubmit={handleSubmit} className="route-form">
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Start location"
              className="route-input"
            />
            <br />
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="End location"
              className="route-input"
            />
            <br />
            <button type="submit" className="route-submit">
              Set Route
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
