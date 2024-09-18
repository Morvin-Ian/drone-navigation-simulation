import { Marker, Popup } from 'react-leaflet';
import { icon } from '../App';

const Drones = ({ drones }) => {
  return (
    <>
      {drones.features.map((drone) => (
        !drone.properties.occupied &&
        <Marker
          key={drone.properties.serial_no}
          position={[drone.geometry.coordinates[1], drone.geometry.coordinates[0]]}
          icon={icon}
        >
          <Popup>
            <div>
              <h6>Name: {drone.properties.name}</h6>
              <h6>Serial No: {drone.properties.serial_no}</h6>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Drones;
