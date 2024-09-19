import {  useState, useRef } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import { Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import useSWR from 'swr';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Facilities from './components/Facilities';
import Drones from './components/Drones';
import RoutingMachine from './components/RoutingMachine';
import Search from './components/Search';
import MovingDrone from './components/MovingDrone';

const fetcher = (url) => axios.get(url).then((res) => res.data);


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
  const [startCordinates, setStartCordinates] = useState(null);
  const [endCordinates, setEndCordinates] = useState(null);
  const [route, setRoute] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState('');
  const [droneRoute, setDroneRoute] = useState(null);
  const [selectedDroneId, setSelectedDroneId] = useState(null);

  const mapRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = new OpenStreetMapProvider();

    if(start === end){
      alert('Departure and Destination locations cannot be the same');
      return;
    }
    const startResults = await provider.search({ query: start });
    const endResults = await provider.search({ query: end });

    if (startResults.length > 0 && endResults.length > 0) {
      const startCoords = [startResults[0].y, startResults[0].x];
      const endCoords = [endResults[0].y, endResults[0].x];

      // Find the selected drone's coordinates
      const selectedDroneObj = fetchedDrones.features.find(drone => drone.properties.name === selectedDrone);
      if (selectedDroneObj) {
        const droneCoords = selectedDroneObj.geometry.coordinates;
        setSelectedDroneId(selectedDroneObj.id)
        setStartCordinates(startCoords)
        setEndCordinates(endCoords)
        setRoute({ droneStart: [droneCoords[1], droneCoords[0]], start: startCoords, end: endCoords });

        // Fit the map to include all three points
        const bounds = L.latLngBounds([droneCoords[1], droneCoords[0]], startCoords, endCoords);
        mapRef.current.fitBounds(bounds);

        setStart("")
        setEnd("")
        setSelectedDrone()
      } else {
        alert('Selected drone not found');
      }
    } else {
      alert('Could not find one or both locations');
    }
  };

  const handleRouteFound = async (coordinates) => {
    setDroneRoute(coordinates);
    
    if (selectedDroneId) {
      try {
        const response = await fetch(`/api/drones/${selectedDroneId}/set_route/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            waypoints: coordinates,
            departure: startCordinates,
            destination: endCordinates
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to set route');
        }
  
        const data = await response.json();
        console.log('Route set successfully:', data);
      } catch (error) {
        console.error('Error setting route:', error);
      }
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
          <Facilities 
            facilities={facilities} 
            setActiveFacility={setActiveFacility} 
          />
          
          <Drones drones={fetchedDrones} />

          {route && (
            <RoutingMachine
              droneStart={route.droneStart}
              start={route.start}
              end={route.end}
              handleRouteFound={handleRouteFound}
            />
          )}

          {droneRoute && (
            <MovingDrone 
              route={droneRoute} 
              droneId={selectedDroneId}
            /> 
          )}
        </MapContainer>

        <div className="route-form-container">
          <h3>Generate Routes</h3>
          <form onSubmit={handleSubmit} className="route-form">
            <select id="mySelect" value={selectedDrone} onClick={(e) => setSelectedDrone(e.target.value)} required className="route-input">
              <option value="">--Please choose an option--</option>
              {drones && drones?.features?.map((drone) => (
                !drone.properties.occupied &&
                <option key={drone?.properties.serial_no} value={drone.properties.name} >
                  {drone.properties.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Depature Healthcare Center"
              className="route-input"
              list="facilities-list"
              required
            />
            <br />
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Destination Healthcare Center"
              className="route-input"
              list="facilities-list"
              required
            />

            {/* Datalist with options from the fetched facilities */}
            <datalist id="facilities-list">
              {facilities?.features.map((facility) => (
                <option key={facility.geometry.coordinates[1]} value={facility.properties.name} />
              ))}
            </datalist>
            <br />
            <button type="submit" className="route-submit">
              Create Route
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
