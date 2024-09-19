import { useEffect, useState, useRef } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

export const red_drone = new L.Icon({
  iconUrl: 'red-drone.png',
  iconSize: [60, 50],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const MovingDrone = ({ route, droneId }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (route && route.length > 0) {
      let i = 0;
      const interval = setInterval(async () => {
        if (i < route.length) {
          setPosition(route[i]);
          if (markerRef.current) {
            markerRef.current.setLatLng(route[i]);
          }
          
          // Send position update to API
          try {
            const response = await fetch(`/api/drones/${droneId}/update_position/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lat: route[i].lat,
                lng: route[i].lng
              }),
            });
            if (!response.ok) {
              throw new Error('Failed to update drone position');
            }
          } catch (error) {
            console.error('Error updating drone position:', error);
          }

          i++;
        } else {
          clearInterval(interval);
          // Route completed, update API using fetch
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
  }, [route, map, droneId]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={red_drone}
      ref={markerRef}
    />
  );
};

export default MovingDrone;