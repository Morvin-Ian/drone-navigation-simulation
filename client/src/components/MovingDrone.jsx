import { useEffect, useState, useRef } from 'react';
import { Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';

export const red_drone = new L.Icon({
  iconUrl: 'red-drone.png',
  iconSize: [60, 50],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const MovingDrone = ({ coordinates, droneId, tracker: initialTracker, name }) => {
  const [position, setPosition] = useState(null);
  const [tracker, setTracker] = useState(initialTracker); 
  const map = useMap();
  const markerRef = useRef(null);
  const websocketRef = useRef(null);

  let route = coordinates;

  // If coordinates is a string, parse it to array
  if (typeof coordinates === 'string') {
    let formattedString = coordinates.replace(/'/g, '"');
    route = JSON.parse(formattedString);
  }


  useEffect(() => {
    if (route && route.length > 0) {
      const interval = setInterval(async () => {
        if (tracker < route.length) {
          const newPosition = route[tracker];
          setPosition(newPosition);

          if (markerRef.current) {
            markerRef.current.setLatLng(newPosition);
          }

          // Send position update to API
          try {
            const response = await fetch(`/api/drones/${droneId}/update_position/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lat: newPosition.lat,
                lng: newPosition.lng,
                drone_tracker: tracker,
              }),
            });
            if (!response.ok) {
              throw new Error('Failed to update drone position');
            }
          } catch (error) {
            console.error('Error updating drone position:', error);
          }

          // Increment the tracker state
          setTracker((prevTracker) => prevTracker + 1);
        } else {
          clearInterval(interval);
          // Route completed, update API 
          try {
            const response = await fetch(`/api/drones/${droneId}/complete_route/`, {
              method: 'POST',
            });
            if (!response.ok) {
              throw new Error('Failed to complete route');
            }
          } catch (error) {
            console.error('Error completing route:', error);
          }
        }
      }, 1000); // Move every second

      return () => clearInterval(interval);
    }
  }, [route, map, droneId, tracker]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={red_drone}
      ref={markerRef}
    >
      <Popup>
        <div>
          <h6>Name: {name}</h6>
          <h6>Status: On a trip </h6>
        </div>
      </Popup>
    </Marker>
  );
};

export default MovingDrone;