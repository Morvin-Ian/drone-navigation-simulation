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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.protocol === 'https:' ? 'domain.com' : '127.0.0.1:8000';

    // Initialize WebSocket connection
    websocketRef.current = new WebSocket(`${protocol}//${host}/ws/drones/${droneId}/`)
    
    websocketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocketRef.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Handle server messages if needed
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

  useEffect(() => {
    if (route && route.length > 0) {
      const interval = setInterval(() => {
        if (tracker < route.length) {
          const newPosition = route[tracker];
          setPosition(newPosition);

          if (markerRef.current) {
            markerRef.current.setLatLng(newPosition);
          }

          // Send position update via WebSocket
          if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({
              lat: newPosition.lat,
              lng: newPosition.lng,
              drone_tracker: tracker,
            }));
          }

          // Increment the tracker state
          setTracker((prevTracker) => prevTracker + 1);
        } else {
          clearInterval(interval);

          // Notify the server that the route is complete via WebSocket
          if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({ action: 'complete_route' }));
          }
        }
      }, 1000); // Move every second

      return () => clearInterval(interval);
    }
  }, [route, map, tracker]);

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
          <h6>Status: On a trip</h6>
        </div>
      </Popup>
    </Marker>
  );
};

export default MovingDrone;
