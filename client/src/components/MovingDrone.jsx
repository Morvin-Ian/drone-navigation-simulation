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
  const [tracker, setTracker] = useState(initialTracker || 0);
  const [status, setStatus] = useState('On a trip');
  const map = useMap();
  const markerRef = useRef(null);
  const websocketRef = useRef(null);

  let route = coordinates;

  // Handling coordinates stored as a string in the database
  if (typeof coordinates === 'string') {
    route = JSON.parse(coordinates.replace(/'/g, '"'));
  }

  // Throttled WebSocket message sender
  const sendPositionUpdate = (lat, lng, tracker) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({ lat, lng, drone_tracker: tracker })
      );
    }
  }; // Throttle to one update per second

  // WebSocket connection setup
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.protocol === 'https:' ? 'domain.com' : '127.0.0.1:8000';
    websocketRef.current = new WebSocket(`${protocol}//${host}/ws/drones/${droneId}/`);

    websocketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);

      if (data.status === 'success') {
        if (data.message === 'Route completed') {
          setStatus('Route completed');
          console.log('Route completed');
        }
      }
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [droneId]);

  // Simulate drone movement
  useEffect(() => {
    if (route && route.length > 0) {
      const interval = setInterval(() => {
        if (tracker < route.length) {
          const newPosition = route[tracker];
          setPosition(newPosition);

          // Send position update via WebSocket
          sendPositionUpdate(newPosition.lat, newPosition.lng, tracker);

          // Move marker on the map
          if (markerRef.current) {
            markerRef.current.setLatLng(newPosition);
          }

          // Update tracker
          setTracker((prevTracker) => prevTracker + 1);
        } else {
          clearInterval(interval);
          setStatus('Route completed');

          // Notify the server that the route is complete
          if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({ action: 'complete_route' }));
          }
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [route, tracker, sendPositionUpdate]);


  if (!position) return null;

  return (
    <Marker position={position} icon={red_drone} ref={markerRef}>
      <Popup>
        <div>
          <h6>Name: {name}</h6>
          <h6>Status: {status}</h6>
        </div>
      </Popup>
    </Marker>
  );
};

export default MovingDrone;
