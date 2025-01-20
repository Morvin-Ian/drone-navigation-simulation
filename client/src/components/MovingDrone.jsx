import { useEffect, useState, useRef, useCallback } from 'react';
import { Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';


export const red_drone = new L.Icon({
  iconUrl: 'red-drone.png',
  iconSize: [60, 50],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const DRONE_STATUS = {
  ACTIVE: 'On a trip',
  COMPLETED: 'Route completed',
  ERROR: 'Error occurred',
  DISCONNECTED: 'Connection lost'
};

const UPDATE_INTERVAL = 1000; // 1 second

const MovingDrone = ({ coordinates, droneId, tracker: initialTracker = 0, name }) => {
  // State
  const [position, setPosition] = useState(null);
  const [tracker, setTracker] = useState(initialTracker);
  const [status, setStatus] = useState(DRONE_STATUS.ACTIVE);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Refs
  const map = useMap();
  const markerRef = useRef(null);
  const websocketRef = useRef(null);
  const intervalRef = useRef(null);

  // Parse coordinates
  const route = useCallback(() => {
    try {
      if (!coordinates) return [];
      return typeof coordinates === 'string' 
        ? JSON.parse(coordinates.replace(/'/g, '"'))
        : coordinates;
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return [];
    }
  }, [coordinates]);

  // WebSocket message sender with throttling
  const sendPositionUpdate = useCallback((lat, lng, tracker) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      websocketRef.current.send(
        JSON.stringify({ 
          lat, 
          lng, 
          drone_tracker: tracker,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Error sending position update:', error);
    }
  }, []);

  // WebSocket connection handler
  const setupWebSocket = useCallback(() => {
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000;

    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
      setStatus(DRONE_STATUS.DISCONNECTED);
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.protocol === 'https:' ? 'domain.com' : '127.0.0.1:8000';
    
    try {
      websocketRef.current = new WebSocket(`${protocol}//${host}/ws/drones/${droneId}/`);

      websocketRef.current.onopen = () => {
        console.log('WebSocket connection established');
        setConnectionAttempts(0);
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'success' && data.message === 'Route completed') {
            setStatus(DRONE_STATUS.COMPLETED);
            clearInterval(intervalRef.current);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus(DRONE_STATUS.ERROR);
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setConnectionAttempts(prev => prev + 1);
        setTimeout(setupWebSocket, RECONNECT_DELAY);
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setTimeout(setupWebSocket, RECONNECT_DELAY);
    }
  }, [droneId, connectionAttempts]);

  // Initialize WebSocket connection
  useEffect(() => {
    setupWebSocket();
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setupWebSocket]);

  // Handle drone movement
  useEffect(() => {
    const parsedRoute = route();
    if (!parsedRoute.length) return;

    intervalRef.current = setInterval(() => {
      if (tracker >= parsedRoute.length) {
        clearInterval(intervalRef.current);
        setStatus(DRONE_STATUS.COMPLETED);
        
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify({ action: 'complete_route' }));
        }
        return;
      }

      const newPosition = parsedRoute[tracker];
      setPosition(newPosition);

      if (markerRef.current) {
        markerRef.current.setLatLng(newPosition);
      }

      sendPositionUpdate(newPosition.lat, newPosition.lng, tracker);
      setTracker(prev => prev + 1);
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [tracker, sendPositionUpdate, route]);

  if (!position) return null;

  return (
    <Marker 
      position={position} 
      icon={red_drone} 
      ref={markerRef}
    >
      <Popup>
        <div className="drone-popup">
          <h6>Name: {name}</h6>
          <h6>Status: {status}</h6>
          {status === DRONE_STATUS.ERROR && (
            <p className="error-message">Connection issues detected</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default MovingDrone;