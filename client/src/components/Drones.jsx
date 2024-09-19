import { Marker, Popup } from 'react-leaflet';
import { icon } from '../App';
import { red_drone } from './MovingDrone';

const Drones = ({ drones }) => {
  return (
    <>
      {drones.features.map((drone) => (
        <Marker
          key={drone.properties.serial_no}
          position={[drone.geometry.coordinates[1], drone.geometry.coordinates[0]]}
          icon={drone.properties.occupied ? red_drone: icon}
        >
          <Popup>
            <div>
              <h6>Name: {drone.properties.name}</h6>
              <h6>Serial No: {drone.properties.serial_no}</h6>
              <h6>Status: {drone.properties.occupied ? 'On a trip' : 'Idle'  }</h6>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Drones;
