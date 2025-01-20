import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Alert, Spinner } from 'react-bootstrap';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Components
import Facilities from './components/Facilities';
import Drones from './components/Drones';
import RoutingMachine from './components/RoutingMachine';
import Search from './components/Search';
import MovingDrone from './components/MovingDrone';
import RouteForm from './components/RouteForm';
import LoadingSpinner from './components/LoadingSpinner';

// Hooks and Utils
import { useFacilities, useDrones } from './hooks/useData';
import { searchLocation, createBounds, calculateDistance } from './utils/mapUtils';
import { API_ENDPOINTS, MAP_CONFIG } from './config/constants';

export const DroneIcon = new L.Icon({
  iconUrl: 'drone.png',
  iconSize: [60, 50],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const App = () => {
  const mapRef = useRef();

  const { facilities, isLoading: facilitiesLoading, error: facilitiesError } = useFacilities();
  const { drones, isLoading: dronesLoading, error: dronesError } = useDrones();

  // State
  const [routeState, setRouteState] = useState({
    activeFacility: null,
    start: '',
    end: '',
    startCoordinates: null,
    endCoordinates: null,
    route: null,
    selectedDrone: '',
    droneRoute: null,
    selectedDroneId: null,
  });

  const [existingTrips, setExistingTrips] = useState([]);

  useEffect(() => {
    if (!drones?.features) return;

    const dronesOnTrip = drones.features.filter(drone => drone?.properties?.occupied);
    const existingRoutes = dronesOnTrip.map(drone => ({
      id: drone.id,
      droneStart: [drone.geometry.coordinates[1], drone.geometry.coordinates[0]],
      start: drone.properties.departure,
      end: drone.properties.destination,
      waypoints: drone.properties.waypoints,
      drone_tracker: drone.properties.drone_tracker,
      name: drone.properties.name,
    }));

    setExistingTrips(prev => [...prev, ...existingRoutes]);
  }, [drones]);

  const handleRouteSubmit = async (formData) => {
    const { start, end, selectedDrone } = formData;

    if (start === end) {
      throw new Error('Departure and Destination locations cannot be the same');
    }

    const [startLocation, endLocation] = await Promise.all([
      searchLocation(start),
      searchLocation(end)
    ]);

    const selectedDroneObj = drones.features.find(
      drone => drone.properties.name === selectedDrone
    );

    if (!selectedDroneObj) {
      throw new Error('Selected drone not found');
    }

    const droneCoords = selectedDroneObj.geometry.coordinates;
    const startCoords = [startLocation[0].y, startLocation[0].x];
    const endCoords = [endLocation[0].y, endLocation[0].x];

    setRouteState(prev => ({
      ...prev,
      selectedDroneId: selectedDroneObj.id,
      startCoordinates: startCoords,
      endCoordinates: endCoords,
      route: {
        droneStart: [droneCoords[1], droneCoords[0]],
        start: startCoords,
        end: endCoords
      }
    }));

    const bounds = createBounds([droneCoords[1], droneCoords[0]], startCoords, endCoords);
    mapRef.current.fitBounds(bounds);
  };

  const handleRouteFound = async (coordinates) => {
    setRouteState(prev => ({ ...prev, droneRoute: coordinates }));

    if (!routeState.selectedDroneId) return;

    try {
      await fetch(`${API_ENDPOINTS.DRONES}/${routeState.selectedDroneId}/set_route/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waypoints: coordinates,
          departure: routeState.startCoordinates,
          destination: routeState.endCoordinates
        }),
      });
    } catch (error) {
      console.error('Error setting route:', error);
      throw new Error('Failed to set route');
    }
  };

  if (facilitiesError || dronesError) {
    return <Alert variant="destructive">Error loading map data</Alert>;
  }

  if (facilitiesLoading || dronesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        ref={mapRef}
        className="h-screen flex-1"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Search provider={new OpenStreetMapProvider()} />
        
        <Facilities
          facilities={facilities}
          setActiveFacility={(facility) => 
            setRouteState(prev => ({ ...prev, activeFacility: facility }))
          }
        />

        <Drones drones={drones} icon={DroneIcon} />

        {existingTrips.map((trip) => (
          <div key={trip.id}>
            <RoutingMachine
              droneStart={trip.droneStart}
              start={trip?.start?.coordinates}
              end={trip?.end?.coordinates}
              waypoints={trip.waypoints}
            />
            {trip?.waypoints && (
              <MovingDrone
                coordinates={trip.waypoints}
                droneId={trip.id}
                tracker={trip.drone_tracker}
                name={trip.name}
              />
            )}
          </div>
        ))}

        {routeState.route && (
          <RoutingMachine
            droneStart={routeState.route.droneStart}
            start={routeState.route.start}
            end={routeState.route.end}
            handleRouteFound={handleRouteFound}
          />
        )}

        {routeState.droneRoute && (
          <MovingDrone
            coordinates={routeState.droneRoute}
            droneId={routeState.selectedDroneId}
            tracker={0}
            name={routeState.start}
          />
        )}
      </MapContainer>

      <RouteForm
        drones={drones}
        facilities={facilities}
        onSubmit={handleRouteSubmit}
      />
    </div>
  );
};

export default App;