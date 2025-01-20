import { Marker, Popup } from 'react-leaflet';
import { DroneIcon } from '../App';

const Drones = ({ drones }) => {
  const idleDrones = drones?.features.filter((drone) => !drone?.properties?.occupied);

  return (
    <>
      {idleDrones.map((drone) => (
        <Marker
          key={drone.properties.serial_no}
          position={[drone.geometry.coordinates[1], drone.geometry.coordinates[0]]}
          icon={DroneIcon}
        >
          <Popup>
            <div>
              <h6>Name: {drone.properties.name}</h6>
              <h6>Serial No: {drone.properties.serial_no}</h6>
              <h6>Status: Idle</h6>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Drones;
