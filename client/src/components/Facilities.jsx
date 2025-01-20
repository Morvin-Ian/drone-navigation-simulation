import { Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';

const Facilities = ({ facilities }) => {
  const facilityMarkers = useMemo(
    () =>
      facilities.features.map((facility) => (
        <Marker
          key={facility.geometry.coordinates[1]}
          position={[facility.geometry.coordinates[1], facility.geometry.coordinates[0]]}
        >
          <Popup>
            <h6>Name: {facility.properties.name || 'Unnamed Facility'}</h6>
            <h6>Amenity: {facility.properties.amenity}</h6>
          </Popup>
        </Marker>
      )),
    [facilities]
  );

  return <>{facilityMarkers}</>;
};

export default Facilities;
