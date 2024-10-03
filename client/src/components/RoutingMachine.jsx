import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ droneStart, start, end, handleRouteFound, existingTrips }) => {
  const map = useMap();
  useEffect(() => {
    if (droneStart && start && end) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(droneStart[0], droneStart[1]),
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ],
        lineOptions: {
          styles: [{ color: 'orangered', weight: 2 }]
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
      }).addTo(map);

      routingControl.on('routesfound', function (e) {
        const routes = e.routes;
        const coordinates = routes[0].coordinates;
        if(handleRouteFound){
          handleRouteFound(coordinates);
        }
      });

      return () => map.removeControl(routingControl);
    }
  }, [map, droneStart, start, end, existingTrips]);

  return null;
};

export default RoutingMachine;