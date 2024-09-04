import { Marker, Popup } from 'react-leaflet';

const Facilities = ({ facilities, setActiveFacility }) => {
  return (
    <>
      {facilities.features.map((facility) => (
        <Marker
          key={facility.geometry.coordinates[1]}
          position={[facility.geometry.coordinates[1], facility.geometry.coordinates[0]]}
          onClick={() => {
            setActiveFacility(facility);
          }}
        >
          <Popup
            position={[facility.geometry.coordinates[1], facility.geometry.coordinates[0]]}
            onClose={() => setActiveFacility(null)}
          >
            <div>
              <h6>Name: {facility.properties.name ? facility.properties.name : 'Unnamed Facility'}</h6>
              <h6>Amenity: {facility.properties.amenity}</h6>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Facilities;
